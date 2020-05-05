#include <D:/OoT_Modding/Code/CAT/gcc/mips64/include/z64ovl/mm/u10.h>
#include <D:/OoT_Modding/Code/CAT/gcc/mips64/include\z64ovl/z64ovl_helpers.h>
#include "defines_limbs.h"
#include "defines_mm.h"

// Actor Information
#define OBJ_ID_CHILD 0x11

#define get_addr_offset(l, o) ((uint32_t *)((uint32_t)l + (uint32_t)o))
#define POLY_OPA ZQDL(global, poly_opa)
#define POLY_XLU ZQDL(global, poly_xlu)

/* Base Offset: 0x06000000 */

typedef struct
{
	uint8_t r;
	uint8_t g;
	uint8_t b;
	uint8_t a;
} z_color;

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
	z_color tunicColor;
	z_color bottleColor;
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
	z64_collider_cylinder_main_t Collision;
} entity_t;

z64_collider_cylinder_init_t Collision =
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

static int8_t copyPlayerAnimFrame(entity_t *en, z64_global_t *global)
{
	memcpy(en->current_frame_data, get_addr_offset(0x80400500, 0x0), 0x86);
}

static void init(entity_t *en, z64_global_t *global)
{
	uint32_t base;
	if (en->actor.variable < 0xFFFF)
	{
		en->puppetData.form = en->actor.variable;
		en->puppetData.playasData.isZZ = 1;

		if (en->puppetData.form == MM_FORM_FIERCE)
		{
			base = 0x80900000;
			Collision.radius = 0x10;
			Collision.height = 0x003;
		}
		else if (en->puppetData.form == MM_FORM_GORON)
		{
			base = 0x80910000;
			Collision.radius = 0x20;
			Collision.height = 0x0025;
		}
		else if (en->puppetData.form == MM_FORM_ZORA)
		{
			base = 0x80920000;
			Collision.radius = 0x9;
			Collision.height = 0x0023;
		}
		else if (en->puppetData.form == MM_FORM_DEKU)
		{
			base = 0x80930000;
			Collision.radius = 0x05;
			Collision.height = 0x0015;
		}
		else if (en->puppetData.form == MM_FORM_HUMAN)
		{
			base = 0x80940000;
			Collision.radius = 0x05;
			Collision.height = 0x002;
		}

		en->puppetData.playasData.base = base;
		uint32_t skele = base + 0x0000500C;
		uint32_t *seg2 = (uint32_t *)skele;
		en->puppetData.playasData.skeleton = *seg2;
	}
	else
	{
		en->puppetData.form = ((uint8_t *)0x801EF690)[0];
		base = 0x80900000 + (en->puppetData.form * 10000);
		en->puppetData.playasData.base = base;
		uint32_t skele = base + 0x0000500C;
		uint32_t *seg2 = (uint32_t *)skele;
		en->puppetData.playasData.skeleton = *seg2;
		en->puppetData.form = *((uint8_t *)base + 0x0000500B);

		Collision.radius = 0x12;
		Collision.height = 0x0020;
	}

	skelanime_init_mtx(
		global,
		&en->skelanime,
		en->puppetData.playasData.skeleton,
		2,
		0, 0, 0);

	actor_anime_change(&en->skelanime, 0, 0.0, 0.0, 0, 0, 1);

	actor_set_scale(&en->actor, 0.01f);

	actor_collider_cylinder_init(global, &en->Collision, &en->actor, &Collision);

	//en->actor.room_index = 0xFF;
	//en->actor.flags = 0x08;

	en->puppetData.bottleColor.r = 0xFF;
	en->puppetData.bottleColor.g = 0xFF;
	en->puppetData.bottleColor.b = 0xFF;
	en->puppetData.bottleColor.a = 0xFF;

	en->puppetData.tunicColor.r = 0xDE;
	en->puppetData.tunicColor.g = 0xAD;
	en->puppetData.tunicColor.b = 0xBE;
	en->puppetData.tunicColor.a = 0xEF;
}

static int MMAnimate(z64_global_t *global, int limb_number, uint32_t *display_list, vec3f_t *translation, vec3s_t *rotation, entity_t *en)
{
	float height;
	if (en->puppetData.form == MM_FORM_FIERCE)
		height = 1.4f; //Size = 1458
	else if (en->puppetData.form == MM_FORM_GORON)
		height = 0.64f;
	else if (en->puppetData.form == MM_FORM_ZORA)
		height = 0.90f;
	else if (en->puppetData.form == MM_FORM_DEKU)
		height = 0.20f;
	else if (en->puppetData.form == MM_FORM_HUMAN)
		height = 0.55f;

	limb_number -= 1;
	if (limb_number == 0)
	{
		z64_rot_t *frame_translation = (z64_rot_t *)en->current_frame_data;
		translation->x += frame_translation->x;
		translation->y += frame_translation->y * height;
		translation->z += frame_translation->z;
	}

	z64_rot_t *frame_limb_rotation = (z64_rot_t *)AADDR(&en->current_frame_data, 6 + (6 * limb_number));

	rotation->x += frame_limb_rotation->x;
	rotation->y += frame_limb_rotation->y;
	rotation->z += frame_limb_rotation->z;

	if (limb_number == LHAND) // left hand
	{

		if (en->puppetData.form == MM_FORM_HUMAN)
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
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_BLADE_KOKIRI_ZZ : HUMAN_DL_BLADE_KOKIRI;
				break;
			case 2:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_BLADE_RAZOR_ZZ : HUMAN_DL_BLADE_RAZOR;
				break;
			case 3:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_BLADE_GILDED_ZZ : HUMAN_DL_BLADE_GILDED;
				break;
			case 4:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_BLADE_GFSWORD_ZZ : HUMAN_DL_BLADE_GFSWORD;
				break;
			case 5:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_HOOKSHOT_ZZ : HUMAN_DL_HOOKSHOT;
				break;
			case 6:
				break;
			case 7:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_LHAND_ZZ : HUMAN_DL_OPEN_HAND;
				break;
			case 8:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_LFIST_ZZ : HUMAN_DL_LFIST;
				break;
			case 9:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_LHAND_BOTTLE_ZZ : HUMAN_DL_LHAND_BOTTLE;
				break;
			}
		}
	}

	else if (limb_number == RHAND)
	{
		if (en->puppetData.form == MM_FORM_HUMAN)
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
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_BOW_ZZ : HUMAN_DL_BOW;
				break;
			case 2:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_HOOKSHOT_ZZ : HUMAN_DL_HOOKSHOT;
				break;
			case 3:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_RHAND_OCARINA_ZZ : HUMAN_DL_RHAND_OCARINA;
				break;
			case 4:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_SHIELD_HERO_ZZ : HUMAN_DL_SHIELD_HERO;
				break;
			case 5:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_SHIELD_MIRROR_ZZ : HUMAN_DL_SHIELD_MIRROR_ZZ;
				break;
			case 6:
				*display_list = en->puppetData.playasData.isZZ ? en->puppetData.playasData.base + HUMAN_DL_SHIELD_MIRROR_FACE_ZZ : HUMAN_DL_SHIELD_MIRROR_FACE_ZZ;
				break;
			}
		}
	}

	else if (limb_number == SHEATH)
	{
		if (en->puppetData.form == MM_FORM_HUMAN)
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
				*display_list = en->puppetData.playasData.isZZ ? HUMAN_DL_SHEATH_KOKIRI_ZZ : HUMAN_DL_SHEATH_KOKIRI;
				break;
			case 2:
				*display_list = en->puppetData.playasData.isZZ ? HUMAN_DL_SHEATH_RAZOR_ZZ : HUMAN_DL_SHEATH_RAZOR;
				break;
			case 3:
				*display_list = en->puppetData.playasData.isZZ ? HUMAN_DL_SHEATH_GILDED_ZZ : HUMAN_DL_SHEATH_GILDED;
				break;
			case 4:
				*display_list = en->puppetData.playasData.isZZ ? HUMAN_DL_SHIELD_HERO_ZZ : HUMAN_DL_SHIELD_HERO;
				break;
			case 5:
				*display_list = en->puppetData.playasData.isZZ ? HUMAN_DL_SHIELD_MIRROR_ZZ : HUMAN_DL_SHIELD_MIRROR;
				break;
			case 6:
				*display_list = en->puppetData.playasData.isZZ ? HUMAN_DL_SHIELD_MIRROR_FACE_ZZ : HUMAN_DL_SHIELD_MIRROR_FACE;
				break;
			}
		}
	}

	return 0;
}

static void play(entity_t *en, z64_global_t *global)
{
	if (en->puppetData.playasData.isZZ)
	{
		const uint32_t eyes[3] = {en->puppetData.playasData.base + 0x00000000, en->puppetData.playasData.base + 0x00000800, en->puppetData.playasData.base + 0x00001000};
		en->puppetData.playasData.eye_texture = eyes[helper_eye_blink(&en->puppetData.playasData.eye_index)];
	}

	actor_collider_cylinder_update(&en->actor, &en->Collision);

	actor_collision_check_set_ot(global, AADDR(global, 0x18884), &en->Collision);
}

#define GFX_POLY_OPA ZQDL(global, poly_opa)

static void otherCallback(z64_global_t *global, uint8_t limb, uint32_t dlist, vec3s_t *rotation, entity_t *en)
{
	z64_disp_buf_t *opa = &GFX_POLY_OPA;
	if (en->puppetData.playasData.isZZ)
	{
		gMoveWd(opa->p++, G_MW_SEGMENT, G_MWO_SEGMENT_8, en->puppetData.playasData.eye_texture);
		gMoveWd(opa->p++, G_MW_SEGMENT, G_MWO_SEGMENT_9, en->puppetData.playasData.base + 0x00004000);
	}
	else
	{
		gMoveWd(opa->p++, G_MW_SEGMENT, G_MWO_SEGMENT_8, zh_seg2ram(0x06000000));
		gMoveWd(opa->p++, G_MW_SEGMENT, G_MWO_SEGMENT_9, zh_seg2ram(0x06004000));
	}

	gMoveWd(opa->p++, G_MW_SEGMENT, G_MWO_SEGMENT_C, 0x800F7A68);

	return 1;
}

static void draw(entity_t *en, z64_global_t *global)
{

	//copyPlayerAnimFrame(en, global);

	gDPSetEnvColor(POLY_OPA.p++, en->puppetData.tunicColor.r, en->puppetData.tunicColor.g, en->puppetData.tunicColor.b, en->puppetData.tunicColor.a);
	//draw_dlist_opa(global, 0x0600C048);
	skelanime_draw_mtx(
		global,
		en->skelanime.limb_index,
		en->skelanime.unk5,
		en->skelanime.dlist_count,
		&MMAnimate, &otherCallback,
		&en->actor);
}

static void destroy(entity_t *en, z64_global_t *global)
{
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