#include <z64ovl\mm\u10.h>
#include <z64ovl\mm\helpers.h>
#include "defines_limbs.h"
#include "defines_mm.h"
#include "structs.h"
#include "printf.h"

//printf on
#define DEBUG

typedef struct
{
	zzplayas_t playas;
	uint16_t form;
	puppet_items_t item;
} puppet_data_t;

typedef struct
{
	z64_actor_t actor;
	uint8_t current_frame_data[0x86];
	puppet_data_t puppet;
	z64_skelanime_t skelanime;
	z64_collider_cylinder_main_t collider;
	vec3s_t dt_rot[(LIMB_TOTAL + 1)];
    vec3s_t dt_pos[(LIMB_TOTAL + 1)];
	uint8_t action_param_1;
	uint8_t action_param_2;
	uint8_t save_sword_equip;
	uint16_t razor_durability;
	vec3s_t shield_rot;
} entity_t;

/*const uint32_t shield_wield[3] = {
	0x00000000
	, MM_ZZ_PUPPET_DLIST(DL_SHIELD_HERO)
	, MM_ZZ_PUPPET_DLIST(DL_SHIELD_MIRROR)
};*/



z64_collider_cylinder_init_t collider_init =
	{
		.body = {
			.unk_0x14 = 0x07,
			.collider_flags = 0x40,
			.collide_flags = 0x09,
			.mask_a = 0x39,
			.mask_b = 0x10,
			.type = 0x01,
			.body_flags = 0x00,
			.toucher_mask = 0x00000000,
			.bumper_effect = 0x00,
			.toucher_damage = 0x04,
			.bumper_mask = 0xFFCFFFFF,
			.toucher_flags = 0x01,
			.bumper_flags = 0x05,
			.body_flags_2 = 0x05},
		.radius = 0x0015,
		.height = 0x0032,
		.y_shift = 0,
		.position = {.x = 0, .y = 0, .z = 0}};

// Function Prototypes
static void init(entity_t *en, z64_global_t *gl);
static void destroy(entity_t *en, z64_global_t *gl);
static void play(entity_t *en, z64_global_t *gl);
static void draw(entity_t *en, z64_global_t *gl);
static void callback_animate_face(z64_global_t *gl, uint8_t limb, uint32_t dlist, vec3s_t *rotation, entity_t *en);
static int32_t callback_set_limb(z64_global_t *gl, int32_t limb, uint32_t *dl, vec3f_t *pos, vec3s_t *rot, entity_t *en);
static void load_mask_object(entity_t* en, uint8_t id);

static void init(entity_t *en, z64_global_t *gl)
{
	//Debugging
	uint32_t _inst = (uint32_t)en;
	uint32_t _nowMask = (uint32_t)&(en->puppet).item.nowMask;
	printf("nowMask: 0x%08X; 0x%02X", _nowMask - _inst, (en->puppet).item.nowMask);

	if ((en->actor).variable < 0xFFFF)
	{
		(en->puppet).form = (en->actor).variable;
		(en->puppet).playas.isZZ = true;

		switch ((en->puppet).form)
		{
		case FORM_DEITY:
			(en->puppet).playas.init = (puppet_init_t){0x80900000, 0x0, 0x0010, 0x0003, 1.50f};
			break;
		case FORM_GORON:
			(en->puppet).playas.init = (puppet_init_t){0x80910000, 0x0, 0x0020, 0x0025, 0.75f};
			break;
		case FORM_ZORA:
			(en->puppet).playas.init = (puppet_init_t){0x80920000, 0x0, 0x0009, 0x0023, 1.0f};
			break;
		case FORM_DEKU:
			(en->puppet).playas.init = (puppet_init_t){0x80930000, 0x0, 0x0005, 0x0015, 0.30f};
			break;
		case FORM_HUMAN:
			(en->puppet).playas.init = (puppet_init_t){0x80940000, 0x0, 0x0005, 0x0002, 0.65f};
			break;
		}

		(en->puppet).playas.init.skeleton = AVAL((en->puppet).playas.init.base, uint32_t, 0x500C);
	}
	
	/* Initialize Skelanime Structure */
    z_skelanime_init_ext(
        gl
		, 1
		, &en->skelanime
		, (en->puppet).playas.init.skeleton
		, 0
		, en->dt_rot
		, en->dt_pos
		, (LIMB_TOTAL + 1)
	);

	z_actor_set_scale(&en->actor, 0.01f);
	z_collider_cylinder_init(gl, &en->collider, &en->actor, &collider_init);
}

static void destroy(entity_t *en, z64_global_t *gl)
{
	z_collider_cylinder_free(gl, &en->collider);
	if ((en->actor).attached_b)
	{
		(en->actor).attached_b->attached_a = 0;
		z_actor_kill((en->actor).attached_b);
		(en->actor).attached_b = 0;
	}
}

static void play(entity_t *en, z64_global_t *gl)
{
	if ((en->puppet).playas.isZZ)
	{
		const uint32_t eyes[3] = {
			(en->puppet).playas.init.base + 0x00000000
			, (en->puppet).playas.init.base + 0x00000800
			, (en->puppet).playas.init.base + 0x00001000
		};
		(en->puppet).playas.eye_texture = eyes[helper_eye_blink(&(en->puppet).playas.eye_index)];
	}

	z_collider_cylinder_update(&en->actor, &en->collider);
	z_collider_set_ot(gl, AADDR(gl, 0x18884), &en->collider);
}

static void draw(entity_t *en, z64_global_t *gl)
{
	z_skelanime_draw(
		gl
		, 0x12
		, en
		, &en->skelanime
		, &callback_set_limb
		, &callback_animate_face
	);
}

static void callback_animate_face(z64_global_t *gl, uint8_t limb, uint32_t dlist, vec3s_t *rotation, entity_t *en)
{
	z64_disp_buf_t *opa = &ZQDL(gl, poly_opa);

	if ((en->puppet).playas.isZZ)
	{
		gSPSegment(opa->p++, 8, (en->puppet).playas.eye_texture);
		gSPSegment(opa->p++, 9, (en->puppet).playas.init.base + 0x00004000);
	}
	else
	{
		gSPSegment(opa->p++, 8, zh_seg2ram(0x06000000));
		gSPSegment(opa->p++, 9, zh_seg2ram(0x06004000));
	}
}

static int32_t callback_set_limb(z64_global_t *gl, int32_t limb, uint32_t *dl, vec3f_t *pos, vec3s_t *rot, entity_t *en)
{
	z64_disp_buf_t* opa = &ZQDL(gl, poly_opa);
	z64_disp_buf_t* xlu = &ZQDL(gl, poly_xlu);

	limb -= 1;

	// Set Animation Frame
	if (!limb)
	{
		vec3s_t* frame_translation = (vec3s_t*)en->current_frame_data;
		pos->x += frame_translation->x;
		pos->y += frame_translation->y * (en->puppet).playas.init.rise;
		pos->z += frame_translation->z;
	}
	vec3s_t* frame_limb_rotation = (vec3s_t*)AADDR(en->current_frame_data, sizeof(vec3s_t) + (sizeof(vec3s_t) * limb));
	rot->x += frame_limb_rotation->x;
	rot->y += frame_limb_rotation->y;
	rot->z += frame_limb_rotation->z;

	// Human Link
	if ((en->puppet).form == FORM_HUMAN)
	{
		// Right Hand
		if (limb == LIMB_HAND_R)
		{
			// Velocity Hands
			if ((en->actor).xz_speed > 2.0f)
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_FIST_R);
			}	
			else
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_HAND_R);
			}

			matrix_push();
			z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
			z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);

			if (en->action_param_2 == 0xFF)
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_FIST_R);
				switch((en->puppet).item.nowShield)
				{
					case 1:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SHIELD_HERO));
						break;
					case 2:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SHIELD_MIRROR));
						break;
				}
			}
			else if (en->action_param_2 > 2 && en->action_param_2 < 6)
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_FIST_R);
				switch((en->puppet).item.nowShield)
				{
					case 1:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SHIELD_HERO));
						break;
					case 2:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SHIELD_MIRROR));
						break;
				}
			}

			matrix_pop();	
		}

		// Left Hand
		if (limb == LIMB_HAND_L)
		{
			// Velocity Hands
			if ((en->actor).xz_speed > 2.0f)
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_FIST_L);
			}	
			else
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_HAND_L);
			}

			if (en->action_param_1 > 0)
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_FIST_L);

				matrix_push();
				z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
				z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);
				switch(en->action_param_1)
				{
					case 3:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_KOKIRI));
						break;
					case 4:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_RAZOR));
						break;
					case 5:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_GILDED_HILT));
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_GILDED_BLADE));
						break;
					case 6:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_FAIRY));
						break;
					case 7:
						matrix_push();
						z_matrix_translate_3f(-428.26f, 267.20f, -33.82f, 1);
						z_matrix_rotate_3s(ROT16(-180), ROT16(0), ROT16(90), 1);
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_DEKU_STICK));
						matrix_pop();
						break;
				}
				matrix_pop();
			}	
		}

		if (limb == LIMB_SHEATH)
		{
			matrix_push();
			z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
			z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);

			if (en->save_sword_equip != 0xFF)
			{
				if (en->action_param_1 > 2 && en->action_param_1 < 6)
				{
					switch(en->save_sword_equip)
					{
						case 0x4D:
							*dl = MM_ZZ_PUPPET_DLIST(DL_SHEATH_KOKIRI);
							break;
						case 0x4E:
							*dl = MM_ZZ_PUPPET_DLIST(DL_SHEATH_RAZOR);
							break;
						case 0x4F:
							*dl = MM_ZZ_PUPPET_DLIST(DL_SHEATH_GILDED);
							break;
					}
				}
				else
				{
					switch(en->save_sword_equip)
					{
						case 0x4D:
							*dl = MM_ZZ_PUPPET_DLIST(DL_SHEATHED_KOKIRI);
							break;
						case 0x4E:
							*dl = MM_ZZ_PUPPET_DLIST(DL_SHEATHED_RAZOR);
							break;
						case 0x4F:
							*dl = MM_ZZ_PUPPET_DLIST(DL_SHEATHED_GILDED);
							break;
					}
				}
			}
			else
			{
				// You have no sword. LUT DF command perhaps?
			}

			// Sword put away, not shielding.
			if ((en->action_param_1 < 3 || en->action_param_1 > 5) && en->action_param_2 != 0xFF)
			{
				switch((en->puppet).item.nowShield)
				{
					case 1:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SHIELD_HERO_ROTATED));
						break;
					case 2:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SHIELD_MIRROR_ROTATED));
						break;
				}
			}

			matrix_pop();
		}

		if (limb == LIMB_HIGH_AFFECTOR)
		{
			z_matrix_rotate_3s(en->shield_rot.x, en->shield_rot.y, en->shield_rot.z, 1);
		}

		if (limb == LIMB_HEAD)
		{
			/*matrix_push();
			z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
			z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);

			//load_mask_object(en, 0x02);
			//gSPSegment(xlu->p++, 0x0A, &en->mask_object);
			//printf("Loaded Mask into Segment 0x0A!", 0);
			switch((en->puppet).item.nowMask)
			{
				case MASK_NONE:
					break;
				case MASK_OF_TRUTH:
					z_cheap_proc_draw_xlu(gl, DL_MASK_OF_TRUTH);
					break;
				case MASK_KAFEI:
					z_cheap_proc_draw_xlu(gl, DL_MASK_KAFEI);
					break;
				case MASK_ALL_NIGHT:
					z_cheap_proc_draw_xlu(gl, DL_MASK_ALL_NIGHT);
					break;
				case MASK_BUNNY:
					//z_cheap_proc_draw_xlu(gl, DL_MASK_BUNNY);
					break;
				case MASK_KEATON:
					z_cheap_proc_draw_xlu(gl, DL_MASK_KEATON);
					break;
				case MASK_GARO:
					z_cheap_proc_draw_xlu(gl, DL_MASK_GARO);
					break;
				case MASK_ROMANI:
					z_cheap_proc_draw_xlu(gl, DL_MASK_ROMANI);
					break;
				case MASK_CIRCUS:
					z_cheap_proc_draw_xlu(gl, DL_MASK_CIRCUS);
					break;
				case MASK_POSTMAN:
					z_cheap_proc_draw_xlu(gl, DL_MASK_POSTMAN);
					break;
				case MASK_COUPLES:
					z_cheap_proc_draw_xlu(gl, DL_MASK_COUPLES);
					break;
				case MASK_FAIRY:
					//z_cheap_proc_draw_xlu(gl, DL_MASK_FAIRY);
					break;
				case MASK_GIBDO:
					z_cheap_proc_draw_xlu(gl, DL_MASK_GIBDO);
					break;
				case MASK_DON_GERO:
					z_cheap_proc_draw_xlu(gl, DL_MASK_DON_GERO);
					break;
				case MASK_KAMARO:
					z_cheap_proc_draw_xlu(gl, DL_MASK_KAMARO);
					break;
				case MASK_CAPTAIN:
					z_cheap_proc_draw_xlu(gl, DL_MASK_CAPTAIN);
					break;
				case MASK_STONE:
					z_cheap_proc_draw_xlu(gl, DL_MASK_STONE);
					break;
				case MASK_BREMEN:
					z_cheap_proc_draw_xlu(gl, DL_MASK_BREMEN);
					break;
				case MASK_BLAST:
					//z_cheap_proc_draw_xlu(gl, DL_MASK_BLAST1);
					break;
				case MASK_OF_SCENTS:
					z_cheap_proc_draw_xlu(gl, DL_MASK_OF_SCENTS);
					break;
				case MASK_GIANT:
					z_cheap_proc_draw_xlu(gl, DL_MASK_GIANT);
					break;
				case MASK_DEITY:
					z_cheap_proc_draw_xlu(gl, DL_MASK_DEITY);
					break;
				case MASK_GORON:
					z_cheap_proc_draw_xlu(gl, DL_MASK_GORON);
					break;
				case MASK_ZORA:
					z_cheap_proc_draw_xlu(gl, DL_MASK_ZORA);
					break;
				case MASK_DEKU:
					z_cheap_proc_draw_xlu(gl, DL_MASK_DEKU);
					break;
			}

			matrix_pop();*/
		}
	}

	return 0;
}

static void load_mask_object(entity_t* en, uint8_t id)
{
	uint16_t mask_objects[25] = {
		0x0000, 0x01DE, 0x01FF, 0x025D
	  , 0x01DB, 0x01DA, 0x01FE, 0x0219
	  , 0x024C, 0x0221, 0x025E, 0x0200
	  , 0x01FD, 0x025C, 0x025F, 0x01DC
	  , 0x024E, 0x0252, 0x01DD, 0x01D9
	  , 0x0214, 0x01E4, 0x01E1, 0x01E2
	  , 0x01E3
	};

	struct objtable
	{
		uint32_t start;
		uint32_t end;
	};

	struct objtable* table = (void*)(0x801C2738 + 8);
	uint32_t vStart = table[mask_objects[id]].start;
	uint32_t vEnd = table[mask_objects[id]].end;
	uint32_t vSize = vEnd - vStart;
	//uint32_t vRam = (uint32_t)en->mask_object;
	//printf("Loading mask (0x%08X - 0x%08X); 0x%04X to 0x%08X...\n", vStart, vEnd, vSize, vRam);
	//load_data_from_rom((uint32_t*)vRam, (uint32_t*)vStart, vSize, "");
}

/* .data */
const z64_actor_init_t init_vars = {
	.number = 0x13,
	.padding = 0x00,
	.type = 0x4,
	.room = 0xFF,
	.flags = 0x00002431,
	.object = 1,
	.instance_size = sizeof(entity_t),
	.init = init,
	.dest = destroy,
	.main = play,
	.draw = draw};