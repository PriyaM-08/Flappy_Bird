let move_speed = 3, gravity = 0.5;

let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let background = document.querySelector(".background").getBoundingClientRect();

let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let sound_point = new Audio("point.mp3");
let sound_die = new Audio("die.mp3");

// Game state
let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && game_state !== "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((el) => el.remove());
    img.style.display = "block";
    bird.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();
  }
});

function play() {
  let bird_dy = 0;
  let bird_top = parseInt(bird.style.top);
  if (isNaN(bird_top)) bird_top = window.innerHeight * 0.4;

  // Controls
  document.addEventListener("keydown", (e) => {
    if (game_state === "Play" && (e.key === "ArrowUp" || e.key === " ")) {
      img.src = "Bird-2.png";
      bird_dy = -7.6; // jump
    }
  });

  document.addEventListener("keyup", (e) => {
    if (game_state === "Play" && (e.key === "ArrowUp" || e.key === " ")) {
      img.src = "Bird.png";
    }
  });

  function apply_gravity() {
    if (game_state !== "Play") return;

    bird_dy += gravity;
    bird_top += bird_dy;
    bird.style.top = bird_top + "px";

    let bird_props = bird.getBoundingClientRect();

    // Collision with ceiling/floor
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      endGame();
      return;
    }
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  // Pipe mechanics
  let pipe_seperation = 0;
  let pipe_gap = 35;

  function create_pipe() {
    if (game_state !== "Play") return;

    if (pipe_seperation > 115) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      // Top pipe
      let pipe_sprite_inv = document.createElement("img");
      pipe_sprite_inv.src = "Pipe.jpg"; // ✅ correct filename
      pipe_sprite_inv.className = "pipe_sprite pipe_top";
      pipe_sprite_inv.style.height = pipe_posi + "vh";
      pipe_sprite_inv.style.left = "100vw";
      document.querySelector(".background").appendChild(pipe_sprite_inv);

      // Bottom pipe
      let pipe_sprite = document.createElement("img");
      pipe_sprite.src = "Pipe.jpg"; // ✅ correct filename
      pipe_sprite.className = "pipe_sprite pipe_bottom";
      pipe_sprite.style.height = (100 - (pipe_posi + pipe_gap)) + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";
      document.querySelector(".background").appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);

  function move_pipes() {
    if (game_state !== "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    let bird_props = bird.getBoundingClientRect();

    pipe_sprite.forEach((element) => {
      let pipe_props = element.getBoundingClientRect();

      if (pipe_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_props.left + pipe_props.width &&
          bird_props.left + bird_props.width > pipe_props.left &&
          bird_props.top < pipe_props.top + pipe_props.height &&
          bird_props.top + bird_props.height > pipe_props.top
        ) {
          endGame();
          return;
        } else {
          if (
            pipe_props.right < bird_props.left &&
            pipe_props.right + move_speed >= bird_props.left &&
            element.increase_score === "1"
          ) {
            score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
            element.increase_score = "0";
            sound_point.play();
          }
          element.style.left = pipe_props.left - move_speed + "px";
        }
      }
    });
    requestAnimationFrame(move_pipes);
  }
  requestAnimationFrame(move_pipes);

  function endGame() {
    game_state = "End";
    message.innerHTML = "Game Over".fontcolor("red") + "<br>Press Enter to Restart";
    message.classList.add("messageStyle");
    img.style.display = "none";
    sound_die.play();
  }
}