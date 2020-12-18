#define SHIELD_HERO   0x01
#define SHIELD_MIRROR 0x02

typedef struct
{
	/* 0x0000 */ uint32_t base;	 // Base RAM Address
	/* 0x0004 */ uint32_t skeleton;
	/* 0x0008 */ uint16_t radius; // Collision Cylinder Radius
	/* 0x000A */ uint16_t height; // Collision Cylinder Height
	/* 0x000C */ float 	 rise;   // Units to be floated
	/* 0x0010 */
} puppet_init_t;

typedef struct
{
    /* 0x0000 */ uint32_t Back;  	// Item on Back
    /* 0x0004 */ uint32_t Left;  	// Held Item (Left Hand)
    /* 0x0008 */ uint32_t Right; 	// Held Item (Right Hand)
	/* 0x000C */ uint8_t nowShield; 	// Currently Equipped Shield
	/* 0x000D */ uint8_t nowMask;    // Currently Worn Mask
	/* 0x000E */ uint8_t _pad[2];
	/* 0x0010 */
} puppet_items_t;

typedef struct
{
	/* 0x0000 */ uint16_t eye_index;
	/* 0x0002 */ uint16_t isZZ;
	/* 0x0004 */ uint32_t eye_texture;
	/* 0x0008 */ puppet_init_t init;
	/* 0x0018 */
} zzplayas_t;

typedef struct
{
	/* 0x0000 */ uint8_t fairy_mask[0x100];

	struct cm
	{
		/* 0x0000 */ vec3f_t pos[2]; // Right, Left
		/* 0x0018 */ int32_t frame[2]; // Left, Right; Some sort of frame counter for the tear growing before it falls from the mask.
		/* 0x0020 */
	} /* 0x0100 */ circus_mask;

	struct bh
	{
		/* 0x0000 */ vec3s_t rot;
		/* 0x0006 */ vec3s_t unk;
		/* 0x000C */
	} /* 0x0120 */ bunny_hood;

	/* 0x012C */
} mask_properties_t;