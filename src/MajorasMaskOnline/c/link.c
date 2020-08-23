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
	float deku_stick_length;
	uint32_t now_anime;
	uint8_t lastMask;
	uint16_t blast_mask_timer;
	mask_properties_t mask_props;
	uint32_t mask_ram_addresses[24];
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
static void callback_animate_face(z64_global_t *gl, int32_t limb, uint32_t dlist, vec3s_t *rotation, void* _en);
static int32_t callback_set_limb(z64_global_t *gl, int32_t limb, uint32_t *dl, vec3f_t *pos, vec3s_t *rot, void* _en);
//static int32_t load_mask_object(uint8_t id, void* vRam);
static void load_masks(entity_t* en, void* vRam);
static rgb8_t bottle_handler(int32_t action_param);

// External Functions
extern void func_801309F4(z64_global_t* gl, uint32_t segment, char* tile_settings);
asm("func_801309F4 = 0x801309F4");

extern void func_8013178C(z64_global_t* gl, char* header);
asm("func_8013178C = 0x8013178C");

static void init(entity_t *en, z64_global_t *gl)
{
	//Debugging
	//uint32_t _inst = (uint32_t)en;
	//uint32_t _nowMask = (uint32_t)&(en->puppet).item.nowMask;
	//char* _debug = "nowMask: 0x%08X; 0x%02X";
	//printf(_debug, _nowMask - _inst, (en->puppet).item.nowMask);

	load_masks(en, (void*)0x80958700);

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

	/*printf("%d en->mask_ram_addresses = \n", 0);
	char* _debug = "0x%08X\n";
	printf(_debug, en->mask_ram_addresses[0]);
	printf(_debug, en->mask_ram_addresses[1]);
	printf(_debug, en->mask_ram_addresses[2]);
	printf(_debug, en->mask_ram_addresses[3]);
	printf(_debug, en->mask_ram_addresses[4]);
	printf(_debug, en->mask_ram_addresses[5]);
	printf(_debug, en->mask_ram_addresses[6]);
	printf(_debug, en->mask_ram_addresses[7]);
	printf(_debug, en->mask_ram_addresses[8]);
	printf(_debug, en->mask_ram_addresses[9]);
	printf(_debug, en->mask_ram_addresses[10]);
	printf(_debug, en->mask_ram_addresses[11]);
	printf(_debug, en->mask_ram_addresses[12]);
	printf(_debug, en->mask_ram_addresses[13]);
	printf(_debug, en->mask_ram_addresses[14]);
	printf(_debug, en->mask_ram_addresses[15]);
	printf(_debug, en->mask_ram_addresses[16]);
	printf(_debug, en->mask_ram_addresses[17]);
	printf(_debug, en->mask_ram_addresses[18]);
	printf(_debug, en->mask_ram_addresses[19]);
	printf(_debug, en->mask_ram_addresses[20]);
	printf(_debug, en->mask_ram_addresses[21]);
	printf(_debug, en->mask_ram_addresses[22]);
	printf(_debug, en->mask_ram_addresses[23]);*/
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
		, callback_set_limb
		, callback_animate_face
	);
}

static void callback_animate_face(z64_global_t* gl, int32_t limb, uint32_t dlist, vec3s_t* rotation, void* _en)
{
	entity_t* en = _en;
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

static int32_t callback_set_limb(z64_global_t* gl, int32_t limb, uint32_t* dl, vec3f_t* pos, vec3s_t* rot, void* _en)
{
	entity_t* en = _en;
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
			matrix_push();
			z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
			z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);

			// Velocity Hands
			if ((en->actor).xz_speed > 2.0f)
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_FIST_R);
			}	
			else
			{
				*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_HAND_R);
			}

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
			else if (en->action_param_2 > (ACTION_SWORD_KOKIRI - 1) && en->action_param_2 < ACTION_SWORD_FAIRY)
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
			matrix_push();
			z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
			z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);

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

				switch(en->action_param_1)
				{
					case ACTION_SWORD_KOKIRI:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_KOKIRI));
						break;
					case ACTION_SWORD_RAZOR:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_RAZOR));
						break;
					case ACTION_SWORD_GILDED:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_GILDED_HILT));
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_GILDED_BLADE));
						break;
					case ACTION_SWORD_FAIRY:
						z_cheap_proc_draw_opa(gl, MM_ZZ_PUPPET_DLIST(DL_SWORD_FAIRY));
						break;
					case ACTION_DEKU_STICK:
						matrix_push();
						z_matrix_translate_3f(-428.26f, 267.20f, -33.82f, 1);
						z_matrix_rotate_3s(ROT16(-180), ROT16(0), ROT16(90), 1);
						z_matrix_scale_3f(1.0f, en->deku_stick_length, 1.0f, 1);
						z_cheap_proc_draw_opa(gl, DL_DEKU_STICK);
						matrix_pop();
						break;
				}
			}

			if	(en->action_param_2 > 0)
			{
				// Bottle
				if (en->action_param_2 > (ACTION_BOTTLE_EMPTY - 1) && en->action_param_2 < (ACTION_BOTTLE_FAIRY + 1))
				{
					*dl = MM_ZZ_PUPPET_DLIST(DL_HUMAN_HAND_L_BOTTLE);
					rgb8_t bc = bottle_handler(en->action_param_2);
					gSPMatrix(xlu->p++, z_matrix_alloc((gl->common).gfx_ctxt, ""), G_MTX_LOAD);
					gDPSetEnvColor(xlu->p++, bc.r, bc.g, bc.b, 255);
					if (en->action_param_2 > ACTION_BOTTLE_EMPTY)
						gSPDisplayList(xlu->p++, DL_BOTTLE_CONTENTS);
					gSPDisplayList(xlu->p++, DL_EMPTY_BOTTLE);
				}
			}
			matrix_pop();
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
			if ((en->action_param_1 < ACTION_SWORD_KOKIRI || en->action_param_1 > ACTION_SWORD_GILDED) && en->action_param_2 != 0xFF)
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
			matrix_push();
			z_matrix_translate_3f(pos->x, pos->y, pos->z, 1);
			z_matrix_rotate_3s(rot->x, rot->y, rot->z, 1);

			if ((en->puppet).item.nowMask > 0)
			{
				uint32_t mask_dlists[] = {
					DL_MASK_OF_TRUTH, DL_MASK_KAFEI, DL_MASK_ALL_NIGHT, DL_MASK_BUNNY
					, DL_MASK_KEATON, DL_MASK_GARO, DL_MASK_ROMANI, DL_MASK_CIRCUS
					, DL_MASK_POSTMAN, DL_MASK_COUPLES, DL_MASK_FAIRY, DL_MASK_GIBDO
					, DL_MASK_DON_GERO, DL_MASK_KAMARO, DL_MASK_CAPTAIN, DL_MASK_STONE
					, DL_MASK_BREMEN, DL_MASK_BLAST, DL_MASK_OF_SCENTS, DL_MASK_GIANT
					, DL_MASK_DEITY, DL_MASK_GORON, DL_MASK_ZORA, DL_MASK_DEKU
				};
				uint32_t mask_id = (en->puppet).item.nowMask - 1;
				gSPSegment(opa->p++, 0x0A, en->mask_ram_addresses[mask_id]);
				if ((en->puppet).item.nowMask == MASK_BUNNY)
				{	
					Mtx* ear_mtx = graph_alloc((gl->common).gfx_ctxt, 0x80);
					vec3s_t* r = &(en->mask_props).bunny_hood.rot;
					vec3s_t ear;
					gSPSegment(opa->p++, 0x0B, ear_mtx);

					// Right Ear
					ear.x = r->y + 0x03E2; ear.y = r->z + 0x0D8E; ear.z = r->x + 0xCB76;
					z_matrix_translate_3f_800D1694(97.0f, -1203.0f, -240.0f, &ear);
					z_matrix_top_to_fixed(ear_mtx, 0, 0);

					// Left Ear
					ear.x = r->y + 0xFC1E; ear.y = 0xF242 - r->z; ear.z = r->x + 0xCB76;
					z_matrix_translate_3f_800D1694(97.0f, -1203.0f, 240.0f, &ear);
					z_matrix_top_to_fixed(ear_mtx + 1, 0, 0);
				}
				/* else if ((en->puppet).item.nowMask == MASK_CIRCUS)
				{
					vec3f_t src_pos_arr[2] = {
						{950.0f, -800.0f, 300.0f}
						, {950.0f, -800.0f, -300.0f}
					};

					vec3f_t* src_pos = src_pos_arr;
					vec3f_t* dest_pos = (vec3f_t*)&(en->mask_props).circus_mask.pos;
					int32_t* frames = (int32_t*)&(en->mask_props).circus_mask.frame;
					float now_framef;
					float now_framei;
					float z;

					do
					{	
						now_framef = ((float)*frames / 400.0f) * 0.1f;
						now_framei = *frames;
						z_matrix_mult_vec3f(src_pos, dest_pos);
						dest_pos->y += now_framef * -10.0f;

						if (now_framei < 400)
						{
							z = 0.05f;
							if (now_framef <= z)
								z = now_framef;

							// Teardrop Display List
							matrix_push();
							z_matrix_translate_3f(dest_pos->x, dest_pos->y, dest_pos->z, 0);
							z_matrix_scale_3f(dest_pos->x, dest_pos->y, dest_pos->z, 1);

							gSPMatrix(xlu->p++, z_matrix_alloc((gl->common).gfx_ctxt, ""), G_MTX_PUSH | G_MTX_LOAD | G_MTX_MODELVIEW);
							gSPSegment(xlu->p++, 8, 0x04091BE0);
							gDPSetPrimColor(xlu->p++, 0, 0, 255, 255, 255, 255);
							gDPSetEnvColor(xlu->p++, 150, 150, 150, 0);
							gSPDisplayList(xlu->p++, DL_DT_BUBBLE);
							gSPPopMatrix(G_MTX_MODELVIEW);

							matrix_pop();
						}
						else
						{
							vec3f_t vel;
							vec3f_t acc;

							float vel_sqrt = SQRT(pow((en->actor).velocity.x, 2) + pow((en->actor).velocity.z, 2));
							uint16_t angle;
							int32_t angle_mult = (vel_sqrt * 2000.0f);

							vel.y = vel_sqrt * 0.4f;
							acc.y = -0.3f;

							if (16000 < angle_mult)
								angle_mult = 16000;

							if (dest_pos == &(en->mask_props).circus_mask.pos[0])
								angle_mult = -angle_mult;

							angle = (uint16_t)((uint32_t)((angle_mult + (en->actor).rot_focus.y) & 0xFFFF));

							z = 4.0f;
							if (vel_sqrt * 0.2f <= z) 
								z = vel_sqrt * 0.2f;

							vel.x = -(z_sin_s(angle) * z);
							vel.z = -(z_cos_s(angle) * z);
							z_effect_spawn_dt_bubble_0(
								gl
								, dest_pos
								, &vel
								, &acc
								, 0x14
								, 0x14
								, 3
								, 0
							);
							*frames -= 400;
						}
						dest_pos += 1; // Next position.
						frames += 1;
						src_pos += 1;
					} while (dest_pos != (vec3f_t*)frames); // Cycle through position vectors.
				} */
				else if ((en->puppet).item.nowMask == MASK_COUPLES)
				{
					// TODO: Mask isn't attached to face?
					// TODO: Eyes break when the mask is worn because segment 0x08 is reassigned.
					// ! Puppet client crashes, despite the mask drawing perfectly well.

					func_8013178C(gl, (char*)zh_seg2ram(DL_MASK_COUPLES_SETTILE));
				}
				else if ((en->puppet).item.nowMask == MASK_FAIRY)
				{
					//Mtx* hair_mtx = graph_alloc((gl->common).gfx_ctxt, 0x180);
				}
				else if ((en->puppet).item.nowMask == MASK_BLAST)
				{
					// TODO: Dynamically allocate 0x801C0BC0 / 0x801C0BD0
					// TODO: Mask isn't attached to face?
					// TODO: Eyes and mouth break when the mask are worn because segment 0x08 and 0x09 are reassigned.

					uint32_t alpha;

					/* Gfx* dl = graph_alloc((gl->common).gfx_ctxt, 0x20);

					gDPSetEnvColor(dl++, 0, 0, 0, 255);
					gSPEndDisplayList(dl++);
					gDPSetRenderMode(dl++, AA_EN | Z_CMP | Z_UPD | IM_RD | CLR_ON_CVG | CVG_DST_WRAP | ZMODE_XLU | FORCE_BL | GBL_c1(G_BL_CLR_FOG, G_BL_A_SHADE, G_BL_CLR_IN, G_BL_1MA), AA_EN | Z_CMP | Z_UPD | IM_RD | CLR_ON_CVG | CVG_DST_WRAP | ZMODE_XLU | FORCE_BL | GBL_c2(G_BL_CLR_IN, G_BL_A_IN, G_BL_CLR_MEM, G_BL_1MA));
					gSPEndDisplayList(dl++); */

					if (en->blast_mask_timer == 0)
					{
						gSPSegment(opa->p++, 9, 0x801C0BC0);
					}
					else
					{
						func_8013178C(gl, (char*)zh_seg2ram(DL_MASK_BLAST_SETTILE)); // Segment 0x08

						if (en->blast_mask_timer < 11)
						{
							alpha = ((en->blast_mask_timer) / 10) * 255;
						}
						else
						{
							alpha = 255;
						}
						gDPSetEnvColor(opa->p++, 0, 0, 0, (alpha & 0xFF));
						gSPDisplayList(opa->p++, DL_MASK_BLAST_1);
						gSPSegment(opa->p++, 9, 0x801C0BD0);
						gDPSetEnvColor(opa->p++, 0, 0, 0, (255 - (alpha & 0xFF)));
					}
				}
				else
				{
					if ((en->puppet).item.nowMask < MASK_GIANT)
					{
						// TODO: An exception for the transformation masks.
					}
					gSPMatrix(opa->p++, z_matrix_alloc((gl->common).gfx_ctxt, ""), G_MTX_LOAD);
				}
				gSPDisplayList(opa->p++, mask_dlists[mask_id]);
			}

			matrix_pop();
		}
	}

	return 0;
}

static void load_masks(entity_t* en, void* vRam)
{
	uint16_t mask_objects[24] = {
		0x01DE, 0x01FF, 0x025D, 0x01DB
	  , 0x01DA, 0x01FE, 0x0219, 0x024C
	  , 0x0221, 0x025E, 0x0200, 0x01FD
	  , 0x025C, 0x025F, 0x01DC, 0x024E
	  , 0x0252, 0x01DD, 0x01D9, 0x0214
	  , 0x01E4, 0x01E1, 0x01E2, 0x01E3
	};

	struct objtable
	{
		uint32_t start;
		uint32_t end;
	};

	uint32_t vStart, vEnd, vSize;
	int32_t r;
	struct objtable* table = (void*)(0x801C2738 + 8);
	void* vRam_Start = vRam;
	for (int id = 0; id < 24; id++)
	{
		vRam_Start += vSize;
		vStart = table[mask_objects[id]].start;
		vEnd = table[mask_objects[id]].end;
		vSize = vEnd - vStart;
		en->mask_ram_addresses[id] = (uint32_t)(vRam_Start);
		r = load_data_from_rom(vRam_Start, (void*)vStart, vSize, "");
		//printf("Wrote (0x%08X - 0x%08X) at 0x%08X.\n", vStart, vEnd, vRam_Start);
	}
}

static rgb8_t bottle_handler(int32_t action_param)
{
  int32_t bottle_id = (action_param - ACTION_BOTTLE_EMPTY);
  rgb8_t bottle_colors[] = {
		{0xFF, 0xFF, 0xFF} /* Empty Bottle */
		, {0x50, 0x50, 0xFF} /* Fish */
		, {0x88, 0xC0, 0xFF} /* Spring Water */
		, {0x88, 0xC0, 0xFF} /* Hot Spring Water */
		, {0xB8, 0xE8, 0xE8} /* Zora Egg */
		, {0xF8, 0xC8, 0x00} /* Deku Princess */
		, {0xFF, 0xB4, 0x00} /* Gold Dust*/
		, {0x00, 0x80, 0x00} /* Unused */
		, {0xFC, 0xEE, 0x00} /* Seahorse */
		, {0x83, 0x00, 0xAE} /* Magic Mushroom */
		, {0x40, 0x40, 0x20} /* Hylian Loach */
		, {0x00, 0x00, 0xFF} /* Bug */
		, {0xFF, 0x00, 0xFF} /* Poe */
		, {0xFF, 0x00, 0xFF} /* Big Poe */
		, {0xFF, 0x00, 0x00} /* Red Potion */
		, {0x00, 0x00, 0xFF} /* Blue Potion */
		, {0x00, 0xC8, 0x00} /* Green Potion */
		, {0xFF, 0xFF, 0xFF} /* Milk */
		, {0xFF, 0xFF, 0xFF} /* Milk (Half) */
		, {0xFF, 0xFF, 0xFF} /* Chateau Romani */
		, {0x50, 0x50, 0xFF} /* Fairy */
	};

  if ((-1 < bottle_id) && (bottle_id < ACTION_BOTTLE_EMPTY))
  {
    return bottle_colors[bottle_id];
  }
  return bottle_colors[0];
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