function check_collision(now){

  player_coin_col(player, coinT1);
  player_coin_col(player, coinT2);
  player_coin_col(player, coinT3);
  player_coin_col(player, coinT4);

  player_large_bar_col(player, barrier1);
  if(player_small_bar_col(player, barrier2)){
    police.pos[2] -= 3.0;
    police_time = now;
    if(police.pos[2] - player.pos[2] <= 2.0){
      alert("  Game Over\n" + "Total Score : " + score + "\nCoins : " + coin_cnt);
      document.location.reload();
    }
  }
  player_train_col(player, train[0]);
  player_train_col(player, train[1]);

  if(player_boot_col(player, boot))
    jump_time = now;
  if(player_jetPack_col(player, jetPack))
    jet_time = now;
}

function detect_collision(A, B){
	return (Math.abs(A.y - B.y) * 2 < (A.b + B.b)) &&
           (Math.abs(A.z - B.z) * 2 < (A.h + B.h)) &&
           (Math.abs(A.x - B.x) * 2 < (A.l + B.l));
}

function make_box(object){

	var x = object.pos[0];
	var y = object.pos[1];
	var z = object.pos[2];

	var l = 0, b = 0, h = 0;
	return{
		x : x,
		y : y,
		z : z,
		l : l,
		b : b,
		h : h,
	}
}

function player_coin_col(player, coinT){

	A = make_box(player);
	A.l = l;
	A.b = 2*(b+r);
	A.h = h;
	for(var i = 0; i < coinT.length; i++){
		B = make_box(coinT[i]);
		B.l = 0.4;
		B.b = 0.4;
		B.h = 0.3;

		if(detect_collision(A, B)){
			score += 100;
			coin_cnt += 1;
			draw();
			coinT[i].pos[0] = 30;
		}
	}
}

function player_large_bar_col(player, barrier){
	A = make_box(player);
	A.l = l;
	A.b = 2*(b+r);
	A.h = h;

	B = make_box(barrier);
	B.l = 2.4;
	B.b = 2.4;
	B.h = 0.3;

	if(detect_collision(A, B)){
		console.log('large barrier');
		alert("  Game Over\n" + "Total Score : " + score + "\nCoins : " + coin_cnt);
		document.location.reload();
	}
}

function player_small_bar_col(player, barrier){
	A = make_box(player);
	A.l = l;
	A.b = 2*(b+r);
	A.h = h;

	B = make_box(barrier);
	B.l = 2.4;
	B.b = 0.36;
	B.h = 0.2;

	if(detect_collision(A, B)){
		console.log('small barrier');
		return true;
	}
	return false;
}

function player_boot_col(player, boot){
	A = make_box(player);
	A.l = l;
	A.b = 2*(b+r);
	A.h = h;

	B = make_box(boot);
	B.l = 1.2;
	B.b = 1.2;
	B.h = 1.3;
	
	if(detect_collision(A, B)){
		console.log('Jump Boot');
		score += 500;
		bigjump = true;
		return true;
	}
	return false;
}

function player_jetPack_col(player, jetPack){
	A = make_box(player);
	A.l = l;
	A.b = 2*(b+r);
	A.h = h;

	B = make_box(jetPack);
	B.l = 1.2;
	B.b = 1.2;
	B.h = 1.3;
	if(detect_collision(A, B)){
		console.log('JetPack');
		score += 500;
		player.pos[1] = 3.0;
		jet = true;
		return true;
	}
	return false;
}

function player_train_col(player, train){
	A = make_box(player);
	A.l = l;
	A.b = 2*(b+r);
	A.h = h;

	B = make_box(train);
	B.z = B.z + 10;
	B.l = 3.0;
	B.b = 6.0;
	B.h = 20.0;

	if(detect_collision(A, B)){
		console.log('large barrier');
		alert("  Game Over\n" + "Total Score : " + score + "\nCoins : " + coin_cnt);
		document.location.reload();
	}
}
