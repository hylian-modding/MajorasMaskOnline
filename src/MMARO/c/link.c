#include <z64ovl/mm/u10.h>
#include <z64ovl/mm/helpers.h>
#include "defines_limbs.h"
#include "defines_mm.h"

// Actor Information
#define OBJ_ID_CHILD 0x11

#define get_addr_offset(l, o) ((uint32_t *)((uint32_t)l + (uint32_t)o))

typedef struct
{
	uint32_t base;	 // Base RAM Address
	uint16_t radius; // Collision Cylinder Radius
	uint16_t height; // Collision Cylinder Height
} puppet_init_t;

typedef struct
{
	uint8_t isZZ;
	uint32_t skeleton;
	uint16_t eye_index;
	uint32_t eye_texture;
	uint32_t base;
} zz_playas;

typedef struct
{
	rgba8_t tunicColor;
	rgba8_t bottleColor;
	zz_playas playasData;
	uint16_t form;
	uint8_t isHandClosed;
	uint8_t heldItemLeft;
	uint8_t heldItemRight;
	uint8_t backItem;
} z_link_puppet;

typedef struct
{
	z64_actor_t actor;
	uint8_t current_frame_data[0x86];
	z_link_puppet puppetData;
	z64_skelanime_t skelanime;
	z64_collider_cylinder_main_t cylinder;
} entity_t;

z64_collider_cylinder_init_t cylinder =
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
static void init(entity_t *en, z64_global_t *global);
static void destroy(entity_t *en, z64_global_t *global);
static void play(entity_t *en, z64_global_t *global);
static void draw(entity_t *en, z64_global_t *global);
static void callback_animate_face(z64_global_t *global, uint8_t limb, uint32_t dlist, vec3s_t *rotation, entity_t *en);
static int32_t callback_set_limb(z64_global_t *global, int32_t limb, uint32_t *dl, vec3f_t *translation, vec3s_t *rotation, entity_t *en);

static void init(entity_t *en, z64_global_t *global)
{
	puppet_init_t puppet_init;
	if (en->actor.variable < 0xFFFF)
	{
		en->puppetData.form = en->actor.variable;
		en->puppetData.playasData.isZZ = 1;

		switch (en->puppetData.form)
		{
		case FORM_LINK_DEITY:
			puppet_init = (puppet_init_t){0x80900000, 0x0010, 0x0003};
			break;
		case FORM_LINK_GORON:
			puppet_init = (puppet_init_t){0x80910000, 0x0020, 0x0025};
			break;
		case FORM_LINK_ZORA:
			puppet_init = (puppet_init_t){0x80920000, 0x0009, 0x0023};
			break;
		case FORM_LINK_DEKU:
			puppet_init = (puppet_init_t){0x80930000, 0x0005, 0x0015};
			break;
		case FORM_LINK_HUMAN:
			puppet_init = (puppet_init_t){0x80940000, 0x0005, 0x0002};
			break;
		}

		en->puppetData.playasData.base = puppet_init.base;
		en->puppetData.playasData.skeleton = AVAL(puppet_init.base, uint32_t, 0x500C);
	}

	z_skelanime_init(global, 1, &en->skelanime, en->puppetData.playasData.skeleton, 2);

	z_actor_set_scale(&en->actor, 0.01f);
	z_collider_cylinder_init(global, &en->cylinder, &en->actor, &cylinder);

	en->puppetData.bottleColor = (rgba8_t){0xFF, 0xFF, 0xFF, 0xFF};
	en->puppetData.tunicColor = (rgba8_t){0x1E, 0x69, 0x1B, 0xFF};
}

static void destroy(entity_t *en, z64_global_t *global)
{
	z_collider_cylinder_free(global, &en->cylinder);
	if (en->actor.attached_b)
	{
		en->actor.attached_b->attached_a = 0;
		z_actor_kill(en->actor.attached_b);
		en->actor.attached_b = 0;
	}
}

static void play(entity_t *en, z64_global_t *global)
{
	if (en->puppetData.playasData.isZZ)
	{
		const uint32_t eyes[3] = {
			en->puppetData.playasData.base + 0x00000000, en->puppetData.playasData.base + 0x00000800, en->puppetData.playasData.base + 0x00001000};
		en->puppetData.playasData.eye_texture = eyes[helper_eye_blink(&en->puppetData.playasData.eye_index)];
	}

	z_collider_cylinder_update(&en->actor, &en->cylinder);
	z_collider_set_ot(global, AADDR(global, 0x18884), &en->cylinder);
}

static void draw(entity_t *en, z64_global_t *global)
{
	z64_disp_buf_t *opa = &ZQDL(global, poly_opa);

	/* 	gDPSetEnvColor(
		opa->p++
		, en->puppetData.tunicColor.r
		, en->puppetData.tunicColor.g
		, en->puppetData.tunicColor.b
		, en->puppetData.tunicColor.a
	); */

	z_skelanime_draw(global, 0x12, en, &en->skelanime, &callback_set_limb, &callback_animate_face);
}

static void callback_animate_face(z64_global_t *global, uint8_t limb, uint32_t dlist, vec3s_t *rotation, entity_t *en)
{
	z64_disp_buf_t *opa = &ZQDL(global, poly_opa);

	if (en->puppetData.playasData.isZZ)
	{
		gSPSegment(opa->p++, 8, en->puppetData.playasData.eye_texture);
		gSPSegment(opa->p++, 9, en->puppetData.playasData.base + 0x00004000);
	}
	else
	{
		gSPSegment(opa->p++, 8, zh_seg2ram(0x06000000));
		gSPSegment(opa->p++, 9, zh_seg2ram(0x06004000));
	}

	return 1;

	//gMoveWd(opa->p++, G_MW_SEGMENT, G_MWO_SEGMENT_C, 0x800F7A68);
}

static int32_t callback_set_limb(z64_global_t *global, int32_t limb, uint32_t *dl, vec3f_t *translation, vec3s_t *rotation, entity_t *en)
{

	float height;

	switch (en->puppetData.form)
	{
	case FORM_LINK_DEITY:
		height = 1.40f;
		break;
	case FORM_LINK_GORON:
		height = 0.64f;
		break;
	case FORM_LINK_ZORA:
		height = 0.90f;
		break;
	case FORM_LINK_DEKU:
		height = 0.20f;
		break;
	case FORM_LINK_HUMAN:
		height = 0.55f;
		break;
	}

	limb -= 1;
	if (limb == 0)
	{
		z64_rot_t *frame_translation = (z64_rot_t *)en->current_frame_data;
		translation->x += frame_translation->x;
		translation->y += frame_translation->y * height;
		translation->z += frame_translation->z;
	}

	z64_rot_t *frame_limb_rotation = (z64_rot_t *)AADDR(&en->current_frame_data, 6 + (6 * limb));

	rotation->x += frame_limb_rotation->x;
	rotation->y += frame_limb_rotation->y;
	rotation->z += frame_limb_rotation->z;

	if (limb == LIMB_HAND_L) // left hand
	{

		if (en->puppetData.form == FORM_LINK_HUMAN)
		{
			switch (en->puppetData.heldItemLeft)
			{

				/*
			0 = Nothing.
			1 = Kokiri Sword (Left Hand)
			2 = Razor Sword (Left Hand)
			3 = Gilded Sword (Left Hand)
			4 = Great Fairy Sword (Left Hand)
			5 = Hookshot (Right Hand)
			6 = Deku Stick (Left Hand)
			7 = Open Hand
			8 = Fist
			9 = Bottle Hand
			*/

			case 1:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_BLADE_KOKIRI);
				break;
			case 2:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_BLADE_RAZOR);
				break;
			case 3:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_BLADE_GILDED);
				break;
			case 4:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_BLADE_GFSWORD);
				break;
			case 5:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_HOOKSHOT);
				break;
			case 6:
				break;
			case 7:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_LHAND_BOTTLE);
				break;
			case 8:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_LFIST);
				break;
			case 9:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_LHAND_BOTTLE);
				break;
			}
		}
	}

	else if (limb == LIMB_HAND_R)
	{
		if (en->puppetData.form == FORM_LINK_HUMAN)
		{

			/*
				0 = Nothing
				1 = Bow
				2 = Hookshot
				3 = Ocarina
				4 = Hero's Shield
				5 = Mirror Shield
				6 = Mirror Shield Face
			*/

			switch (en->puppetData.heldItemRight)
			{
			case 1:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_BOW);
				break;
			case 2:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_HOOKSHOT);
				break;
			case 3:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_RHAND_OCARINA);
				break;
			case 4:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHIELD_HERO);
				break;
			case 5:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHIELD_MIRROR);
				break;
			case 6:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHIELD_MIRROR_FACE);
				break;
			}
		}
	}

	else if (limb == LIMB_SHEATH)
	{
		if (en->puppetData.form == FORM_LINK_HUMAN)
		{

			/*
				0 = Nothing
				1 = Kokiri Sheath
				2 = Razor Sheath
				3 = Gilded Sheath
				4 = Hero's Shield
				5 = Mirror Shield
				6 = Mirror Shield Face
			*/

			switch (en->puppetData.backItem)
			{
			case 1:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHEATH_KOKIRI);
				break;
			case 2:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHEATH_RAZOR);
				break;
			case 3:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHEATH_GILDED);
				break;
			case 4:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHIELD_HERO);
				break;
			case 5:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHIELD_MIRROR);
				break;
			case 6:
				*dl = MM_ZZ_PUPPET_DLIST(HUMAN_DL_SHIELD_MIRROR_FACE);
				break;
			}
		}
	}

	return 0;
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