#include <z64ovl\mm\u10.h>
#include <z64ovl\mm\helpers.h>
#include "defines_limbs.h"
#include "defines_mm.h"
#include "structs.h"

typedef struct
{
	zzplayas_t playas;
	uint16_t form;
	puppet_items_t item;
} puppet_data_t;

typedef struct
{
	z64_actor_t actor;
	puppet_data_t puppet;
	uint8_t current_frame_data[0x86];
	z64_skelanime_t skelanime;
	z64_collider_cylinder_main_t cylinder;
	vec3s_t dt_rot[(LIMB_TOTAL + 1)];
    vec3s_t dt_pos[(LIMB_TOTAL + 1)];
	
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
static void init(entity_t *en, z64_global_t *gl);
static void destroy(entity_t *en, z64_global_t *gl);
static void play(entity_t *en, z64_global_t *gl);
static void draw(entity_t *en, z64_global_t *gl);
static void callback_animate_face(z64_global_t *gl, uint8_t limb, uint32_t dlist, vec3s_t *rotation, entity_t *en);
static int32_t callback_set_limb(z64_global_t *gl, int32_t limb, uint32_t *dl, vec3f_t *translation, vec3s_t *rotation, entity_t *en);

static void init(entity_t *en, z64_global_t *gl)
{
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
	z_collider_cylinder_init(gl, &en->cylinder, &en->actor, &cylinder);
}

static void destroy(entity_t *en, z64_global_t *gl)
{
	z_collider_cylinder_free(gl, &en->cylinder);
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

	z_collider_cylinder_update(&en->actor, &en->cylinder);
	z_collider_set_ot(gl, AADDR(gl, 0x18884), &en->cylinder);
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

static int32_t callback_set_limb(z64_global_t *gl, int32_t limb, uint32_t *dl, vec3f_t *translation, vec3s_t *rotation, entity_t *en)
{
	limb -= 1;
	if (limb == 0)
	{
		z64_rot_t *frame_translation = (z64_rot_t *)en->current_frame_data;
		translation->x += frame_translation->x;
		translation->y += frame_translation->y * (en->puppet).playas.init.rise;
		translation->z += frame_translation->z;
	}

	z64_rot_t *frame_limb_rotation = (z64_rot_t *)AADDR(&en->current_frame_data, 6 + (6 * limb));

	rotation->x += frame_limb_rotation->x;
	rotation->y += frame_limb_rotation->y;
	rotation->z += frame_limb_rotation->z;

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