PROGRAM = link
OVLOUT = $(PROGRAM).zovl
ADDRESS = 0x80803000
OBJDUMP = mips64-objdump
PARTS = $(PROGRAM).o

Z64OVL_LD  = /opt/n64/mips64/include/z64ovl/z64ovl.ld
OUTDIR = C:/Z64/zzplayas/MMO/MMARO/src/MMARO/payloads/E0/

CC   = mips64-gcc
LD   = mips64-ld
NOVL = novl

CFLAGS = -G 0 -Os --std=gnu99 -mtune=vr4300 -mabi=32 -mips3 -mno-check-zero-division -mno-explicit-relocs -mno-memcpy
LDFLAGS = -T $(Z64OVL_LD) --emit-relocs
NOVLFLAGS = -v -c -A $(ADDRESS) -o $(OVLOUT)

default: clean $(PROGRAM).ovl copy

$(PROGRAM).ovl: $(PARTS)
	$(LD) -o $(PROGRAM).elf $(PARTS) $(LDFLAGS)
	$(NOVL) $(NOVLFLAGS) $(PROGRAM).elf

conf:
	@echo "allocation   0x0000" > zzrtl_conf.txt
	@echo "vram         "$(ADDRESS) >> zzrtl_conf.txt
	@echo -n "ivar         0x" >> zzrtl_conf.txt
	@$(OBJDUMP) -t $(PROGRAM).elf | grep init_vars | head -c 8 >> zzrtl_conf.txt

clean:
	rm -fv $(PROGRAM).elf $(OVLOUT) $(PARTS)

copy:
	cp $(PROGRAM).zovl $(OUTDIR)"link.ovl"
