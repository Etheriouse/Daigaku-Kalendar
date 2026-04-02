


const 1 %_t0
mov %n0 %_t0

const 1 %_t2
sub %_t1 %n0 %_t2

const 1 %_t4
eq %_t3 %_t1 %_t4
ifnot secondcase %_t3
//first case
const 0 %_t0
mov %x1 %_t0
goto endcase
//second case
const 2 %_t4
eq %_t3 %_t1 %_t4
ifnot defaultcase %_t3

label secondcase
const 1 %_t0
mov %x1 %_t0
goto endcase

//default case
label defaultcase
const 42 %_t0
mov %x1 %_t0
goto endcase


label endcase