'use strict';
/* BrickL — lessons 1–3. Plain JS, no build step. */

// ---------- Geometry ----------
// One hole = U px. Two gears mesh when axle distance (in holes) = (teeth1 + teeth2) / 16.
const U = 56, COLS = 13, ROWS = 7, OX = 56, OY = 56;
const BW = OX * 2 + (COLS - 1) * U, BH = OY * 2 + (ROWS - 1) * U;
const holeX = (h) => OX + h * U, holeY = (h) => OY + h * U;
const radius = (t) => (t * U) / 16;
const GEAR_COL = { 8: ['#3E7BEA', '#1F55B5', '#EEF3FD'], 16: ['#8E5BD9', '#5E33A8', '#F3EEFC'], 24: ['#F2A33A', '#B86E0F', '#FFF6EA'] };
const TAU = Math.PI * 2;
const MOTOR_SPEED = 1.4;      // rad/s
const STRENGTH_NEEDED = 2.9;  // lesson 2: box needs about 3x force
const LIFT_PER_RAD = 60;      // px of rope per radian of the load axle
const MAX_LIFT = 160;

const pathCache = {};
function gearPath(N, r) {
  const key = N + ':' + r;
  if (pathCache[key]) return pathCache[key];
  const m = (2 * r) / N, ro = r + m * 0.95, rr = r - m * 1.15, t = TAU / N, pts = [];
  for (let i = 0; i < N; i++) {
    const c = i * t;
    for (const [f, R] of [[-0.5, rr], [-0.3, rr], [-0.14, ro], [0.14, ro], [0.3, rr]]) {
      const a = c + f * t;
      pts.push((R * Math.cos(a)).toFixed(1) + ',' + (R * Math.sin(a)).toFixed(1));
    }
  }
  return (pathCache[key] = 'M' + pts.join('L') + 'Z');
}
// Angle of gear 2 so its teeth fit gear 1 (direction th from 1 to 2).
const meshAngle = (a1, t1, t2, th) => th + Math.PI + Math.PI / t2 - (t1 / t2) * (a1 - th);

// ---------- Text (EN / DE) ----------
const T = {
  en: {
    tagline: 'Learn engineering with bricks', path: 'Your path',
    tiers: ['Basics', 'Mechanisms', 'Machines'], tierSub: ['Learn the parts', 'Make things move', 'Combine your tools'],
    lessons: ['Fast gears', 'Strong gears', 'Flip it', 'Axles and bushes', 'Gear chain', 'Crank and winch', 'Worm gear', 'Up and down', 'Turn a corner', 'Levers', 'Push and pull', 'Crane', 'Elevator', 'Forklift', 'Steering', 'Plane controls'],
    lesson: 'Lesson', start: 'Start', soon: 'Coming soon', doneTag: 'Done',
    steps: ['Idea', 'Play', 'Build'],
    next: 'Next', back: 'Back', listen: 'Read aloud', stopAudio: 'Stop reading', home: 'Home',
    parts: 'Parts', dragTip: 'Drag parts onto the board',
    axle: 'Axle', gear: 'Gear', motor: 'Motor', big: 'big', small: 'small', medium: 'medium', left: 'left',
    goal: 'GOAL', motorBtn: 'Motor', flip: 'Flip', helpers: 'Helpers', test: 'Test it!', hint: 'Hint',
    dropAxle: 'Axles go into a hole.', dropGear: 'Gears go on an axle.', dropMotor: 'The motor goes on an axle.', full: 'This axle already has a gear.', noneLeft: 'None left. Remove one from the board first.', fixed: 'This part stays here.',
    jamToast: 'Stuck! Two gears push into each other.', heavy: 'Too heavy! The motor can’t turn it.', heavyHand: 'Too heavy to turn this gear.',
    fail1: 'Not yet. Try again!', fail2: 'Not yet. Want a hint?', getHint: 'Get a hint', moreHint: 'More help', ok: 'OK',
    pointText: 'Look where it blinks.', showText: 'Put the parts on the shadows.', looksRight: 'It looks right! Press “Test it!”',
    win: 'You did it!', toBuild: 'Now build it for real',
    findParts: 'Find these parts', haveAll: 'I have them all', missing: 'Missing a part? You can still look at the steps.',
    beam9: 'Beam, 9 holes', axle4: 'Axle, 4 long', g24: 'Gear, 24 teeth', g8: 'Gear, 8 teeth', g16: 'Gear, 16 teeth', bush: 'Bush', string: 'String', toy: 'A small toy',
    front: 'front', backSide: 'back', finish: 'Finish', done: 'Lesson done!', toMap: 'Back to the map', nextLesson: 'Next lesson',
    disclaimer: 'BrickL is not made by, sponsored by or connected to the LEGO Group.',
    crankS: 'Crank, short', crankL: 'Crank, long', oneHole: '1 hole', twoHoles: '2 holes',
    dropCrank: 'The crank goes on an axle.', oneCrank: 'Only one crank. Remove the other one first.', atFlag: 'At the flag! Press \u201cTest it!\u201d',
    task: 'Task', fits: 'It fits!', nextTask: 'Next task', wall: 'wall',
    axles: 'Axles, different lengths', beam3: 'Short beam, 3 holes', pin: 'Pin', l2build: 'Your build from lesson 2',
    pivot: 'Pivot', tapPivot: 'Tap a hole on the beam to move the pivot.', tooHeavyPush: 'Too heavy! Try moving the pivot.', boxSide: 'box side', handSide: 'your side', holesW: 'holes',
    pinNear: 'Pin, near the middle', pinMid: 'Pin, middle', pinEdge: 'Pin, at the edge', bell: 'bell',
    tFast: 'Fast gears', tStrong: 'Strong gears', tWorm: 'Worm gear', tRack: 'Rack', hookMotor: 'Hook motor', armMotor: 'Arm motor', hook: 'Hook', arm: 'Arm', dropSlot: 'Put the tool on a motor box.', weakPress: 'Too weak! This motor needs a stronger tool.',
    worm: 'Worm gear', b12: 'Bevel gear 12', b20: 'Bevel gear 20', flat24: 'Gear 24, flat', slanted: 'slanted', flatW: 'flat', rack: 'Gear rack', locked: 'Locked! The worm holds it.', motorLbl: 'motor', fan: 'fan',
    L: [
      {
        idea: 'A big gear turns a small gear.\nThe small gear spins fast!',
        ideaSub: 'Watch the white dots. The big gear turns 1 time. The small gear turns 3 times.',
        goal: 'Make the small gear spin 3 times faster than the big gear. Use the motor.',
        prob: {
          axle: 'Gears need axles. Drag an axle into a hole first.', big: 'Put the big gear (24 teeth) on an axle.', small: 'Put the small gear (8 teeth) on an axle.',
          motor: 'The motor must turn the big gear. Put the motor on the big gear’s axle.', jam: 'Two gears push into each other. Move one away.',
          touch: 'Do the gears touch? Their teeth must fit together.', on: 'Switch the motor on!', ratio: 'Look at the speed numbers. Is the small gear 3×?',
        },
        winSub: 'The small gear spins 3 times faster than the big gear.',
        b: ['Take the beam. Count the holes from the left.', 'Push an axle into hole 2.', 'Push the second axle into hole 4.', 'Slide the big gear onto the first axle.', 'Slide the small gear onto the second axle. The teeth must touch.', 'Put a bush on the back of each axle, so nothing falls out.'],
        testQ: 'Test it! Turn the big gear 1 time, slowly. How many times does the small gear turn?',
        right: 'Yes! 3 times. Small gear = fast.', wrong: 'Count again, slowly. A sticker on the small gear helps.',
        tool: 'New tool: Fast gears',
      },
      {
        idea: 'A small gear turns a big gear.\nThe big gear is slow, but strong!',
        ideaSub: 'Slow and strong can lift heavy things. The small gear turns 3 times. The big gear turns 1 time.',
        goal: 'The motor is weak. Lift the heavy box up to the flag.',
        prob: {
          axle: 'You need one more axle. Drag it into a hole.', big: 'Put the big gear (24 teeth) on the axle with the string.', small: 'Put the small gear (8 teeth) on an axle.',
          motor: 'The motor must turn the small gear. Put the motor on the small gear’s axle.', weak: 'Too heavy! Let the motor turn a small gear. The small gear turns the big gear.',
          jam: 'Two gears push into each other. Move one away.', touch: 'Do the gears touch? Their teeth must fit together.', on: 'Switch the motor on!',
          down: 'The box goes down! Press Flip to change the way the motor turns.',
        },
        winSub: 'Small gear turns big gear: slow, but strong enough to lift the box.',
        b: ['Take the beam. Count the holes from the left.', 'Push an axle into hole 2 and one into hole 4.', 'Slide the small gear onto the axle in hole 2.', 'Slide the big gear onto the axle in hole 4. The teeth must touch.', 'Tie the string to the back of the big gear’s axle. Tie a small toy to the other end.', 'Hold the beam at the edge of a table, so the toy hangs down.'],
        testQ: 'Test it! Turn the small gear’s axle. Then turn the big gear’s axle. Which one lifts the toy more easily?',
        opts: ['Small gear’s axle', 'Big gear’s axle'],
        right: 'Yes! With the small gear it is easy. But it is slow.', wrong: 'Try both again, slowly. Which one feels lighter?',
        tool: 'New tool: Strong gears',
      },
      {
        idea: 'Two gears turn opposite ways.\nPut a gear in the middle, and it flips back!',
        ideaSub: 'Watch the arrows. Gear 1 and gear 3 turn the same way. Gear 2 turns the other way.',
        goal: 'Make the gear on the ★ axle turn the same way as the motor gear.',
        prob: {
          motorGear: 'Put a gear on the motor axle.', starGear: 'Put a gear on the ★ axle.', axle: 'You need an axle in the middle.',
          jam: 'Two gears push into each other. Move one away.', touch: 'Do all the gears touch? Add a gear in the middle.', on: 'Switch the motor on!',
          same: 'The ★ gear turns the wrong way. Look at the arrows. Is there a gear in the middle?',
        },
        winSub: 'The middle gear flips the direction back. Now both turn the same way.',
        b: ['Take the beam. Count the holes from the left.', 'Push axles into holes 1, 4 and 7.', 'Slide gears onto the axles in hole 1 and hole 7. Turn one. Does the other move?', 'No, they don’t touch! Now slide a gear onto the middle axle.', 'Put a bush on the back of each axle.'],
        testQ: 'Test it! Turn the first gear like a clock. Which way does the last gear turn?',
        opts: ['Like a clock', 'The other way'],
        right: 'Yes! With a gear in the middle, it turns the same way.', wrong: 'Look again. A sticker on the last gear helps.',
        tool: 'New tool: Flip direction',
      },
      {
        idea: 'An axle must go through every part.\nCount the parts. That is the axle length!',
        ideaSub: 'Gear + beam + bush = 3 parts. So you need an axle 3. This picture looks from the top.',
        goal: 'Pick the axle that fits. It must go through all the parts, but not hit the wall.',
        prob: {
          pick: 'Drag an axle onto the parts.', short: 'Too short! A part falls off. Count the parts.', long: 'Too long! It hits the wall. Try a shorter axle.',
        },
        winSub: 'Count the parts, and you know the axle length.',
        b: ['Find your axles. Lay each axle next to a beam and count the holes. That is the axle length.', 'Push an axle 3 through a beam. Put a gear on the front and a bush on the back.', 'Now try an axle 2. The bush does not fit! The axle is too short.'],
        testQ: 'Gear + beam + beam + bush. How long must the axle be?',
        right: 'Yes! 4 parts, so an axle 4.', wrong: 'Count the parts again: gear, beam, beam, bush.',
        tool: 'New tool: The right axle',
      },
      {
        idea: 'Gears in the middle don\u2019t change the speed.\nOnly the first and the last gear count!',
        ideaSub: 'Big gear first, small gear last: 3 times faster. The middle gear just passes the turning on.',
        goal: 'The \u2605 gear is far away. Make it spin 3 times faster than the motor gear.',
        prob: {
          motorGear: 'Put a gear on the motor axle. Big or small?', starGear: 'Put a gear on the \u2605 axle.', axle: 'The gap is too wide. Add axles in between.',
          jam: 'Two gears push into each other. Move one away.', touch: 'Do all the gears touch? Fill the gap with gears.', on: 'Switch the motor on!',
          ratio: 'Look at the speed numbers. Only the first and the last gear count: first big, last small.',
        },
        winSub: 'The middle gears just pass the turning on. First big, last small: 3 times faster!',
        b: ['Take the beam. Count the holes from the left.', 'Push axles into holes 1, 4, 7 and 9.', 'Slide big gears onto the axles in holes 1, 4 and 7.', 'Slide the small gear onto the axle in hole 9.', 'Put a bush on the back of each axle.'],
        testQ: 'Test it! Turn the first gear 1 time, slowly. How many times does the small gear turn?',
        right: 'Yes! 3 times, just like with 2 gears. The middle gears don\u2019t change the speed.', wrong: 'Count again, slowly. A sticker on the small gear helps.',
        tool: 'New tool: Gear chain',
      },
      {
        idea: 'A crank is a handle that turns an axle.\nA long crank makes turning easier!',
        ideaSub: 'Your hand moves farther, but pushes less. A winch winds up a string to lift things.',
        goal: 'Lift the heavy box to the flag. Turn the crank with your finger.',
        prob: {
          crank: 'Put a crank on the axle with the string.', heavy: 'Too heavy! Try a longer crank. Or let a small gear turn a big gear.',
          touch: 'The crank must turn the axle with the string. Do the gears touch?', jam: 'Two gears push into each other. Move one away.',
          turn: 'Now turn the crank with your finger until the box reaches the flag.',
        },
        winSub: 'Crank and winch: turn, turn, turn, and the box goes up!',
        b: ['Take your build from lesson 2: small gear, big gear, string and toy.', 'Slide a short beam onto the front of the small gear\u2019s axle. That is the crank.', 'Push a pin into the last hole of the short beam. That is the handle.', 'Turn the handle. The string winds up and lifts the toy!'],
        testQ: 'Test it! Hold the crank near the axle. Then hold it at the very end. Where is it easier to turn?',
        opts: ['Near the axle', 'At the end'],
        right: 'Yes! At the end your hand moves farther, but it is easier.', wrong: 'Try both again. Where do you push less?',
        tool: 'New tool: Crank and winch',
      },
      {
        idea: 'A worm gear looks like a screw.\nIt turns a gear very slowly, and it locks!',
        ideaSub: 'Each turn of the worm moves the big gear by just 1 tooth. And the big gear cannot turn the worm back.',
        goal: 'Lift the box to the flag. Then switch the motor off. The box must not fall down!',
        prob: {
          big: 'Put the big gear (24 teeth) on the axle with the string.', motor: 'Put the motor on the part that should turn the big gear.',
          jam: 'Two parts push into each other. Move one away.', touch: 'Does it touch the big gear? A worm goes right next to the gear, so its thread fits in the teeth.',
          weak: 'Too heavy! The motor needs help to turn the big gear.', lift: 'Switch the motor on and lift the box up to the flag. Going down? Press Flip.',
          off: 'Now switch the motor off. Does the box stay up?', falls: 'The box fell down when the motor stopped! Try a worm gear: it locks.',
        },
        winSub: 'The worm gear lifts slowly and holds the box. Nothing falls down!',
        b: ['Find the worm gear. It looks like a screw.', 'Put the worm on an axle. Put the big gear on another axle.', 'Hold them so the gear\u2019s teeth sit in the worm\u2019s thread. The axles cross like a +.', 'Turn the worm\u2019s axle with your fingers. Watch the big gear turn slowly.'],
        testQ: 'Test it! Now try to turn the big gear instead. What happens?',
        opts: ['The worm turns', 'It is stuck'],
        right: 'Yes! The worm locks the gear. Cranes use this, so the load can\u2019t fall.', wrong: 'Try again: hold the worm\u2019s axle still and push the big gear.',
        tool: 'New tool: Worm gear',
      },
      {
        idea: 'A rack is a straight bar with teeth.\nA gear turning on it pushes it up or down!',
        ideaSub: 'Turning becomes straight movement. Turn the gear one way: up. The other way: down.',
        goal: 'Push the platform up to the flag with the rack.',
        prob: {
          pinion: 'Put a gear where its teeth touch the rack\u2019s teeth.', motor: 'Put the motor on the gear that should turn.',
          jam: 'Two gears push into each other. Move one away.', touch: 'Does the motor gear reach the gear at the rack? The gears must touch.',
          on: 'Switch the motor on!', lift: 'Keep going until the platform reaches the flag. Going down? Press Flip.',
        },
        winSub: 'The gear turns, and the rack goes straight up. That is a rack and pinion!',
        b: ['Find a gear rack. It is a straight bar with teeth.', 'Put the small gear on an axle.', 'Hold the rack so its teeth touch the gear\u2019s teeth.', 'Turn the axle. The rack slides!'],
        testQ: 'Test it! Turn the gear one way, then the other way. What does the rack do?',
        opts: ['It slides one way, then back', 'It spins around'],
        right: 'Yes! Turning becomes sliding. Forklifts and car steering use this.', wrong: 'Look again. Does the rack spin, or does it slide?',
        tool: 'New tool: Rack and pinion',
      },
      {
        idea: 'Bevel gears are slanted.\nThey can turn a corner!',
        ideaSub: 'The motor turns one axle. The bevel gears pass the turning around the corner to the other axle. This picture looks from the top.',
        goal: 'Make the fan turn as fast as the motor. The axles meet at a corner.',
        goals: ['Make the fan turn as fast as the motor. The axles meet at a corner.', 'Now make the fan spin faster than the motor.'],
        prob: {
          empty: 'Put a gear on each axle end: one on the motor axle, one on the fan axle.', flat: 'Flat gears can\u2019t turn this corner. Their teeth don\u2019t meet. Try the slanted bevel gears.',
          size: 'The fan should turn as fast as the motor. Use two gears of the same size.', faster: 'To make the fan faster: big bevel gear on the motor axle, small one on the fan axle.',
        },
        winSub: 'Bevel gears turn a corner. Big to small makes it faster, just like flat gears!',
        b: ['Find two bevel gears. Their teeth are slanted.', 'Put each bevel gear on an axle.', 'Hold the axles like an L, so the slanted teeth meet.', 'Turn one axle. The other one turns around the corner!'],
        testQ: 'Test it! With two same-size bevel gears: turn one axle 1 time. How many times does the other axle turn?',
        right: 'Yes! Same size, same speed. Just around a corner.', wrong: 'Count again, slowly. A sticker on the gear helps.',
        tool: 'New tool: Turn a corner',
      },
      {
        idea: 'A lever is a bar that tips on a pivot, like a seesaw.\nWhere the pivot is changes everything!',
        ideaSub: 'Pivot close to the box: easy to push, but the box goes up only a little. Pivot in the middle: harder, but the box goes up high.',
        goal: 'Lift the heavy box with one finger.',
        goals: ['Lift the heavy box with one finger. Tap a hole to move the pivot, then push the red end down.', 'This box is light. Now lift it up high, to the flag.'],
        prob: {
          heavy: 'Too heavy! Move the pivot closer to the box.', low: 'The box doesn\u2019t go high enough. Move the pivot away from the box.', push: 'Now push the red end down with your finger.',
        },
        winSub: 'Pivot near the load: strong, but a small move. Pivot far away: a big move, but harder. Engineers choose!',
        b: ['Build a small stand: a stack of bricks with a pin on top.', 'Put a long beam on the pin. It tips like a seesaw.', 'Put a toy on one end. Push the other end down.', 'Move the beam so the pin is close to the toy. Push again.'],
        testQ: 'Test it! Where was it easier to push?',
        opts: ['Pin close to the toy', 'Pin in the middle'],
        right: 'Yes! Pivot close to the load makes it easy, but the toy goes up less.', wrong: 'Try both again. Where do you need less push?',
        tool: 'New tool: Lever',
      },
      {
        idea: 'A turning wheel with a rod makes something slide back and forth.\nTrains and engines work like this!',
        ideaSub: 'The pin goes round and round. The rod pushes and pulls. The farther the pin is from the middle, the longer the push.',
        goal: 'Ring the far bell. The slider must reach it.',
        goals: ['Ring the far bell. The slider must reach it.', 'Now ring the near bell gently. Don\u2019t knock it over!'],
        prob: {
          pin: 'Put a pin on the wheel.', on: 'Switch the motor on!',
          short: 'The slider doesn\u2019t reach the bell. Put the pin farther from the middle.', long: 'Too far! The bell falls over. Put the pin closer to the middle.',
        },
        winSub: 'Pin far from the middle: a long push. Pin near the middle: a short push.',
        b: ['Put a short beam (3 holes) on an axle. That is the crank.', 'Push a pin into the last hole of the short beam.', 'Put a long beam on the pin. That is the rod. Its other end slides on the table.', 'Turn the crank. The rod pushes and pulls!'],
        testQ: 'Test it! Move the pin to the middle hole of the short beam. Does the rod move more or less?',
        opts: ['More', 'Less'],
        right: 'Yes! Pin closer to the middle = a shorter push.', wrong: 'Watch the end of the rod. How far does it go now?',
        tool: 'New tool: Push and pull',
      },
      {
        idea: 'A crane uses two tools at once:\none lifts the hook, one raises the arm.',
        ideaSub: 'Both must be strong. And both must hold still when the motor stops, or the load falls!',
        goal: 'Lift the crate to the flag and raise the arm to the dotted line. Both must stay up when you let go.',
        prob: {
          hoistEmpty: 'Choose a tool for the hook motor.', boomEmpty: 'Choose a tool for the arm motor.',
          hoistWeak: 'The hook motor is too weak. Which tool makes it strong?', boomWeak: 'The arm motor is too weak. Which tool makes it strong?',
          hoistFalls: 'The crate slides down when you let go! Which tool locks?', boomFalls: 'The arm falls down when you let go! Which tool locks?',
          hoistLow: 'Hold the hook \u25b2 button until the crate reaches the flag.', boomLow: 'Hold the arm \u25b2 button until the arm reaches the dotted line.',
        },
        winSub: 'Worm gears make both motors strong, and they lock. Your crane holds everything!',
        b: ['Build a tower: stand two long beams up on a base.', 'Put your worm winch from lesson 7 on top of the tower.', 'Tie the string to the winch. Make a hook at the end.', 'Turn the worm. The hook goes up and stays there!'],
        testQ: 'Test it! Why does a crane use a worm gear?',
        opts: ['It locks, so the load can\u2019t fall', 'It is the fastest gear'],
        right: 'Yes! The worm holds the load, even when the motor stops.', wrong: 'Think about lesson 7: what happened when the motor stopped?',
        tool: 'New machine: Crane',
      },
    ],
  },
  de: {
    tagline: 'Technik lernen mit Steinen', path: 'Dein Weg',
    tiers: ['Grundlagen', 'Mechanik', 'Maschinen'], tierSub: ['Lerne die Teile kennen', 'Bring Dinge in Bewegung', 'Kombiniere deine Werkzeuge'],
    lessons: ['Schnelle Zahnräder', 'Starke Zahnräder', 'Umdrehen', 'Achsen und Buchsen', 'Zahnrad-Kette', 'Kurbel und Seilwinde', 'Schneckengetriebe', 'Hoch und runter', 'Um die Ecke', 'Hebel', 'Schieben und ziehen', 'Kran', 'Aufzug', 'Gabelstapler', 'Lenkung', 'Flugzeug-Steuerung'],
    lesson: 'Lektion', start: 'Los', soon: 'Kommt bald', doneTag: 'Geschafft',
    steps: ['Idee', 'Spielen', 'Bauen'],
    next: 'Weiter', back: 'Zurück', listen: 'Vorlesen', stopAudio: 'Vorlesen stoppen', home: 'Startseite',
    parts: 'Teile', dragTip: 'Zieh Teile aufs Brett',
    axle: 'Achse', gear: 'Zahnrad', motor: 'Motor', big: 'groß', small: 'klein', medium: 'mittel', left: 'übrig',
    goal: 'ZIEL', motorBtn: 'Motor', flip: 'Umdrehen', helpers: 'Helfer', test: 'Testen!', hint: 'Tipp',
    dropAxle: 'Achsen kommen in ein Loch.', dropGear: 'Zahnräder kommen auf eine Achse.', dropMotor: 'Der Motor kommt auf eine Achse.', full: 'Auf dieser Achse ist schon ein Zahnrad.', noneLeft: 'Keins mehr da. Nimm erst eins vom Brett.', fixed: 'Dieses Teil bleibt hier.',
    jamToast: 'Es klemmt! Zwei Zahnräder drücken ineinander.', heavy: 'Zu schwer! Der Motor schafft es nicht.', heavyHand: 'Zu schwer, um dieses Zahnrad zu drehen.',
    fail1: 'Noch nicht. Versuch es nochmal!', fail2: 'Noch nicht. Möchtest du einen Tipp?', getHint: 'Tipp zeigen', moreHint: 'Mehr Hilfe', ok: 'OK',
    pointText: 'Schau, wo es blinkt.', showText: 'Leg die Teile auf die Schatten.', looksRight: 'Sieht gut aus! Drück auf „Testen!“',
    win: 'Geschafft!', toBuild: 'Jetzt in echt bauen',
    findParts: 'Such diese Teile', haveAll: 'Ich habe alle', missing: 'Fehlt ein Teil? Du kannst die Schritte trotzdem anschauen.',
    beam9: 'Balken, 9 Löcher', axle4: 'Achse, 4 lang', g24: 'Zahnrad, 24 Zähne', g8: 'Zahnrad, 8 Zähne', g16: 'Zahnrad, 16 Zähne', bush: 'Buchse', string: 'Schnur', toy: 'Ein kleines Spielzeug',
    front: 'vorne', backSide: 'hinten', finish: 'Fertig', done: 'Lektion geschafft!', toMap: 'Zurück zur Karte', nextLesson: 'Nächste Lektion',
    disclaimer: 'BrickL ist kein Produkt der LEGO Gruppe und wird von ihr weder unterstützt noch gesponsert.',
    crankS: 'Kurbel, kurz', crankL: 'Kurbel, lang', oneHole: '1 Loch', twoHoles: '2 Löcher',
    dropCrank: 'Die Kurbel kommt auf eine Achse.', oneCrank: 'Nur eine Kurbel. Nimm erst die andere weg.', atFlag: 'An der Fahne! Drück auf \u201eTesten!\u201c',
    task: 'Aufgabe', fits: 'Passt!', nextTask: 'Nächste Aufgabe', wall: 'Wand',
    axles: 'Achsen, verschieden lang', beam3: 'Kurzer Balken, 3 Löcher', pin: 'Pin', l2build: 'Dein Bau aus Lektion 2',
    pivot: 'Drehpunkt', tapPivot: 'Tipp auf ein Loch im Balken, um den Drehpunkt zu versetzen.', tooHeavyPush: 'Zu schwer! Versetz den Drehpunkt.', boxSide: 'Kisten-Seite', handSide: 'deine Seite', holesW: 'Löcher',
    pinNear: 'Pin, nah an der Mitte', pinMid: 'Pin, Mitte', pinEdge: 'Pin, am Rand', bell: 'Glocke',
    tFast: 'Schnelle Zahnräder', tStrong: 'Starke Zahnräder', tWorm: 'Schnecke', tRack: 'Zahnstange', hookMotor: 'Haken-Motor', armMotor: 'Arm-Motor', hook: 'Haken', arm: 'Arm', dropSlot: 'Leg das Werkzeug auf einen Motor-Kasten.', weakPress: 'Zu schwach! Dieser Motor braucht ein stärkeres Werkzeug.',
    worm: 'Schnecke', b12: 'Kegelrad 12', b20: 'Kegelrad 20', flat24: 'Zahnrad 24, flach', slanted: 'schräg', flatW: 'flach', rack: 'Zahnstange', locked: 'Gesperrt! Die Schnecke hält es fest.', motorLbl: 'Motor', fan: 'Ventilator',
    L: [
      {
        idea: 'Ein großes Zahnrad dreht ein kleines.\nDas kleine dreht sich schnell!',
        ideaSub: 'Schau auf die weißen Punkte. Das große dreht sich 1-mal. Das kleine dreht sich 3-mal.',
        goal: 'Lass das kleine Zahnrad 3-mal schneller drehen als das große. Nimm den Motor.',
        prob: {
          axle: 'Zahnräder brauchen Achsen. Zieh zuerst eine Achse in ein Loch.', big: 'Steck das große Zahnrad (24 Zähne) auf eine Achse.', small: 'Steck das kleine Zahnrad (8 Zähne) auf eine Achse.',
          motor: 'Der Motor muss das große Zahnrad drehen. Steck ihn auf die Achse vom großen Zahnrad.', jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.',
          touch: 'Berühren sich die Zahnräder? Die Zähne müssen ineinander passen.', on: 'Schalte den Motor an!', ratio: 'Schau auf die Zahlen. Dreht das kleine Zahnrad 3×?',
        },
        winSub: 'Das kleine Zahnrad dreht sich 3-mal schneller als das große.',
        b: ['Nimm den Balken. Zähl die Löcher von links.', 'Steck eine Achse in Loch 2.', 'Steck die zweite Achse in Loch 4.', 'Schieb das große Zahnrad auf die erste Achse.', 'Schieb das kleine Zahnrad auf die zweite Achse. Die Zähne müssen sich berühren.', 'Steck hinten auf jede Achse eine Buchse, damit nichts herausfällt.'],
        testQ: 'Teste es! Dreh das große Zahnrad 1-mal, ganz langsam. Wie oft dreht sich das kleine?',
        right: 'Ja! 3-mal. Kleines Zahnrad = schnell.', wrong: 'Zähl nochmal, ganz langsam. Ein Aufkleber am kleinen Zahnrad hilft.',
        tool: 'Neues Werkzeug: Schnelle Zahnräder',
      },
      {
        idea: 'Ein kleines Zahnrad dreht ein großes.\nDas große ist langsam, aber stark!',
        ideaSub: 'Langsam und stark kann schwere Dinge heben. Das kleine dreht sich 3-mal. Das große dreht sich 1-mal.',
        goal: 'Der Motor ist schwach. Heb die schwere Kiste bis zur Fahne.',
        prob: {
          axle: 'Du brauchst noch eine Achse. Zieh sie in ein Loch.', big: 'Steck das große Zahnrad (24 Zähne) auf die Achse mit der Schnur.', small: 'Steck das kleine Zahnrad (8 Zähne) auf eine Achse.',
          motor: 'Der Motor muss das kleine Zahnrad drehen. Steck ihn auf die Achse vom kleinen Zahnrad.', weak: 'Zu schwer! Lass den Motor ein kleines Zahnrad drehen. Das kleine dreht das große.',
          jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.', touch: 'Berühren sich die Zahnräder? Die Zähne müssen ineinander passen.', on: 'Schalte den Motor an!',
          down: 'Die Kiste geht nach unten! Drück auf Umdrehen, dann dreht der Motor andersherum.',
        },
        winSub: 'Kleines Zahnrad dreht großes: langsam, aber stark genug für die Kiste.',
        b: ['Nimm den Balken. Zähl die Löcher von links.', 'Steck eine Achse in Loch 2 und eine in Loch 4.', 'Schieb das kleine Zahnrad auf die Achse in Loch 2.', 'Schieb das große Zahnrad auf die Achse in Loch 4. Die Zähne müssen sich berühren.', 'Bind die Schnur hinten an die Achse vom großen Zahnrad. Bind ein kleines Spielzeug ans andere Ende.', 'Halt den Balken an die Tischkante, damit das Spielzeug herunterhängt.'],
        testQ: 'Teste es! Dreh an der Achse vom kleinen Zahnrad. Dann an der Achse vom großen. Womit hebst du das Spielzeug leichter?',
        opts: ['Achse vom kleinen Zahnrad', 'Achse vom großen Zahnrad'],
        right: 'Ja! Mit dem kleinen Zahnrad geht es leicht. Aber langsam.', wrong: 'Probier beide nochmal, ganz langsam. Was fühlt sich leichter an?',
        tool: 'Neues Werkzeug: Starke Zahnräder',
      },
      {
        idea: 'Zwei Zahnräder drehen sich andersherum.\nEin Zahnrad in der Mitte dreht es wieder um!',
        ideaSub: 'Schau auf die Pfeile. Zahnrad 1 und Zahnrad 3 drehen sich gleich herum. Zahnrad 2 dreht sich andersherum.',
        goal: 'Lass das Zahnrad auf der ★-Achse genauso herum drehen wie das Motor-Zahnrad.',
        prob: {
          motorGear: 'Steck ein Zahnrad auf die Motor-Achse.', starGear: 'Steck ein Zahnrad auf die ★-Achse.', axle: 'Du brauchst eine Achse in der Mitte.',
          jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.', touch: 'Berühren sich alle Zahnräder? Setz ein Zahnrad in die Mitte.', on: 'Schalte den Motor an!',
          same: 'Das ★-Zahnrad dreht sich falsch herum. Schau auf die Pfeile. Ist ein Zahnrad in der Mitte?',
        },
        winSub: 'Das Zahnrad in der Mitte dreht die Richtung wieder um. Jetzt drehen sich beide gleich herum.',
        b: ['Nimm den Balken. Zähl die Löcher von links.', 'Steck Achsen in Loch 1, 4 und 7.', 'Schieb Zahnräder auf die Achsen in Loch 1 und Loch 7. Dreh eins. Bewegt sich das andere?', 'Nein, sie berühren sich nicht! Jetzt schieb ein Zahnrad auf die mittlere Achse.', 'Steck hinten auf jede Achse eine Buchse.'],
        testQ: 'Teste es! Dreh das erste Zahnrad wie einen Uhrzeiger. In welche Richtung dreht sich das letzte?',
        opts: ['Wie ein Uhrzeiger', 'Andersherum'],
        right: 'Ja! Mit einem Zahnrad in der Mitte dreht es sich gleich herum.', wrong: 'Schau nochmal. Ein Aufkleber auf dem letzten Zahnrad hilft.',
        tool: 'Neues Werkzeug: Richtung umdrehen',
      },
      {
        idea: 'Eine Achse muss durch alle Teile gehen.\nZähl die Teile. So lang muss die Achse sein!',
        ideaSub: 'Zahnrad + Balken + Buchse = 3 Teile. Also brauchst du eine Achse 3. Dieses Bild zeigt alles von oben.',
        goal: 'Such die passende Achse aus. Sie muss durch alle Teile gehen, darf aber nicht an die Wand stoßen.',
        prob: {
          pick: 'Zieh eine Achse zu den Teilen.', short: 'Zu kurz! Ein Teil fällt ab. Zähl die Teile.', long: 'Zu lang! Sie stößt an die Wand. Probier eine kürzere Achse.',
        },
        winSub: 'Zähl die Teile, dann weißt du, wie lang die Achse sein muss.',
        b: ['Such deine Achsen. Leg jede Achse neben einen Balken und zähl die Löcher. So lang ist die Achse.', 'Steck eine Achse 3 durch einen Balken. Vorne kommt ein Zahnrad drauf, hinten eine Buchse.', 'Probier jetzt eine Achse 2. Die Buchse passt nicht mehr! Die Achse ist zu kurz.'],
        testQ: 'Zahnrad + Balken + Balken + Buchse. Wie lang muss die Achse sein?',
        right: 'Ja! 4 Teile, also eine Achse 4.', wrong: 'Zähl die Teile nochmal: Zahnrad, Balken, Balken, Buchse.',
        tool: 'Neues Werkzeug: Die richtige Achse',
      },
      {
        idea: 'Zahnräder in der Mitte ändern die Geschwindigkeit nicht.\nNur das erste und das letzte zählen!',
        ideaSub: 'Großes Zahnrad zuerst, kleines zuletzt: 3-mal schneller. Das mittlere gibt das Drehen nur weiter.',
        goal: 'Das \u2605-Zahnrad ist weit weg. Lass es 3-mal schneller drehen als das Motor-Zahnrad.',
        prob: {
          motorGear: 'Steck ein Zahnrad auf die Motor-Achse. Groß oder klein?', starGear: 'Steck ein Zahnrad auf die \u2605-Achse.', axle: 'Die Lücke ist zu groß. Setz Achsen dazwischen.',
          jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.', touch: 'Berühren sich alle Zahnräder? Füll die Lücke mit Zahnrädern.', on: 'Schalte den Motor an!',
          ratio: 'Schau auf die Zahlen. Nur das erste und das letzte Zahnrad zählen: zuerst groß, zuletzt klein.',
        },
        winSub: 'Die mittleren Zahnräder geben das Drehen nur weiter. Zuerst groß, zuletzt klein: 3-mal schneller!',
        b: ['Nimm den Balken. Zähl die Löcher von links.', 'Steck Achsen in Loch 1, 4, 7 und 9.', 'Schieb große Zahnräder auf die Achsen in Loch 1, 4 und 7.', 'Schieb das kleine Zahnrad auf die Achse in Loch 9.', 'Steck hinten auf jede Achse eine Buchse.'],
        testQ: 'Teste es! Dreh das erste Zahnrad 1-mal, ganz langsam. Wie oft dreht sich das kleine?',
        right: 'Ja! 3-mal, genau wie mit 2 Zahnrädern. Die mittleren ändern die Geschwindigkeit nicht.', wrong: 'Zähl nochmal, ganz langsam. Ein Aufkleber am kleinen Zahnrad hilft.',
        tool: 'Neues Werkzeug: Zahnrad-Kette',
      },
      {
        idea: 'Eine Kurbel ist ein Griff, der eine Achse dreht.\nMit einer langen Kurbel geht es leichter!',
        ideaSub: 'Deine Hand macht einen längeren Weg, muss aber weniger drücken. Eine Seilwinde wickelt eine Schnur auf und hebt Dinge hoch.',
        goal: 'Heb die schwere Kiste bis zur Fahne. Dreh die Kurbel mit dem Finger.',
        prob: {
          crank: 'Steck eine Kurbel auf die Achse mit der Schnur.', heavy: 'Zu schwer! Probier eine längere Kurbel. Oder lass ein kleines Zahnrad ein großes drehen.',
          touch: 'Die Kurbel muss die Achse mit der Schnur drehen. Berühren sich die Zahnräder?', jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.',
          turn: 'Jetzt dreh die Kurbel mit dem Finger, bis die Kiste an der Fahne ist.',
        },
        winSub: 'Kurbel und Seilwinde: drehen, drehen, drehen, und die Kiste geht hoch!',
        b: ['Nimm deinen Bau aus Lektion 2: kleines Zahnrad, großes Zahnrad, Schnur und Spielzeug.', 'Steck einen kurzen Balken vorne auf die Achse vom kleinen Zahnrad. Das ist die Kurbel.', 'Steck einen Pin in das letzte Loch vom kurzen Balken. Das ist der Griff.', 'Dreh am Griff. Die Schnur wickelt sich auf und hebt das Spielzeug!'],
        testQ: 'Teste es! Halt die Kurbel nah an der Achse fest. Dann ganz am Ende. Wo lässt sie sich leichter drehen?',
        opts: ['Nah an der Achse', 'Ganz am Ende'],
        right: 'Ja! Am Ende macht deine Hand einen längeren Weg, aber es geht leichter.', wrong: 'Probier beides nochmal. Wo musst du weniger drücken?',
        tool: 'Neues Werkzeug: Kurbel und Seilwinde',
      },
      {
        idea: 'Eine Schnecke sieht aus wie eine Schraube.\nSie dreht ein Zahnrad ganz langsam, und sie sperrt!',
        ideaSub: 'Bei jeder Umdrehung der Schnecke bewegt sich das große Zahnrad nur um 1 Zahn. Und das große Zahnrad kann die Schnecke nicht zurückdrehen.',
        goal: 'Heb die Kiste bis zur Fahne. Dann schalte den Motor aus. Die Kiste darf nicht herunterfallen!',
        prob: {
          big: 'Steck das große Zahnrad (24 Zähne) auf die Achse mit der Schnur.', motor: 'Steck den Motor auf das Teil, das das große Zahnrad drehen soll.',
          jam: 'Zwei Teile drücken ineinander. Schieb eins weg.', touch: 'Berührt es das große Zahnrad? Eine Schnecke kommt direkt neben das Zahnrad, damit ihr Gewinde in die Zähne passt.',
          weak: 'Zu schwer! Der Motor braucht Hilfe, um das große Zahnrad zu drehen.', lift: 'Schalte den Motor an und heb die Kiste bis zur Fahne. Geht es runter? Drück auf Umdrehen.',
          off: 'Jetzt schalte den Motor aus. Bleibt die Kiste oben?', falls: 'Die Kiste ist heruntergefallen, als der Motor aufgehört hat! Probier eine Schnecke: Sie sperrt.',
        },
        winSub: 'Die Schnecke hebt langsam und hält die Kiste fest. Nichts fällt herunter!',
        b: ['Such die Schnecke. Sie sieht aus wie eine Schraube.', 'Steck die Schnecke auf eine Achse. Steck das große Zahnrad auf eine andere Achse.', 'Halt sie so, dass die Zähne vom Zahnrad im Gewinde der Schnecke sitzen. Die Achsen kreuzen sich wie ein +.', 'Dreh die Achse der Schnecke mit den Fingern. Schau, wie sich das große Zahnrad langsam dreht.'],
        testQ: 'Teste es! Versuch jetzt, das große Zahnrad zu drehen. Was passiert?',
        opts: ['Die Schnecke dreht sich', 'Es klemmt'],
        right: 'Ja! Die Schnecke sperrt das Zahnrad. Kräne nutzen das, damit die Last nicht herunterfällt.', wrong: 'Probier es nochmal: Halt die Achse der Schnecke fest und drück das große Zahnrad.',
        tool: 'Neues Werkzeug: Schnecke',
      },
      {
        idea: 'Eine Zahnstange ist ein gerader Stab mit Zähnen.\nEin Zahnrad darauf schiebt sie hoch oder runter!',
        ideaSub: 'Aus Drehen wird eine gerade Bewegung. In die eine Richtung drehen: hoch. In die andere: runter.',
        goal: 'Schieb die Plattform mit der Zahnstange bis zur Fahne hoch.',
        prob: {
          pinion: 'Setz ein Zahnrad dahin, wo seine Zähne die Zähne der Zahnstange berühren.', motor: 'Steck den Motor auf das Zahnrad, das sich drehen soll.',
          jam: 'Zwei Zahnräder drücken ineinander. Schieb eins weg.', touch: 'Erreicht das Motor-Zahnrad das Zahnrad an der Zahnstange? Die Zahnräder müssen sich berühren.',
          on: 'Schalte den Motor an!', lift: 'Weiter so, bis die Plattform an der Fahne ist. Geht es runter? Drück auf Umdrehen.',
        },
        winSub: 'Das Zahnrad dreht sich, und die Zahnstange geht gerade nach oben. Das ist ein Zahnstangengetriebe!',
        b: ['Such eine Zahnstange. Sie ist ein gerader Stab mit Zähnen.', 'Steck das kleine Zahnrad auf eine Achse.', 'Halt die Zahnstange so, dass ihre Zähne die Zähne vom Zahnrad berühren.', 'Dreh die Achse. Die Zahnstange schiebt sich!'],
        testQ: 'Teste es! Dreh das Zahnrad in die eine Richtung, dann in die andere. Was macht die Zahnstange?',
        opts: ['Sie schiebt sich hin und zurück', 'Sie dreht sich im Kreis'],
        right: 'Ja! Aus Drehen wird Schieben. Gabelstapler und Autolenkungen nutzen das.', wrong: 'Schau nochmal. Dreht sich die Zahnstange, oder schiebt sie sich?',
        tool: 'Neues Werkzeug: Zahnstange',
      },
      {
        idea: 'Kegelräder sind schräg.\nSie können um die Ecke drehen!',
        ideaSub: 'Der Motor dreht eine Achse. Die Kegelräder geben das Drehen um die Ecke an die andere Achse weiter. Dieses Bild zeigt alles von oben.',
        goal: 'Lass den Ventilator so schnell drehen wie den Motor. Die Achsen treffen sich an einer Ecke.',
        goals: ['Lass den Ventilator so schnell drehen wie den Motor. Die Achsen treffen sich an einer Ecke.', 'Jetzt lass den Ventilator schneller drehen als den Motor.'],
        prob: {
          empty: 'Steck an jedes Achsenende ein Zahnrad: eins an die Motor-Achse, eins an die Ventilator-Achse.', flat: 'Flache Zahnräder können hier nicht um die Ecke drehen. Ihre Zähne treffen sich nicht. Probier die schrägen Kegelräder.',
          size: 'Der Ventilator soll so schnell drehen wie der Motor. Nimm zwei gleich große Zahnräder.', faster: 'Damit der Ventilator schneller dreht: großes Kegelrad an die Motor-Achse, kleines an die Ventilator-Achse.',
        },
        winSub: 'Kegelräder drehen um die Ecke. Von groß zu klein wird es schneller, genau wie bei flachen Zahnrädern!',
        b: ['Such zwei Kegelräder. Ihre Zähne sind schräg.', 'Steck jedes Kegelrad auf eine Achse.', 'Halt die Achsen wie ein L, sodass sich die schrägen Zähne treffen.', 'Dreh eine Achse. Die andere dreht sich um die Ecke mit!'],
        testQ: 'Teste es! Mit zwei gleich großen Kegelrädern: Dreh eine Achse 1-mal. Wie oft dreht sich die andere?',
        right: 'Ja! Gleich groß, gleich schnell. Nur eben um die Ecke.', wrong: 'Zähl nochmal, ganz langsam. Ein Aufkleber am Zahnrad hilft.',
        tool: 'Neues Werkzeug: Um die Ecke',
      },
      {
        idea: 'Ein Hebel ist ein Balken, der auf einem Drehpunkt kippt, wie eine Wippe.\nWo der Drehpunkt ist, macht den Unterschied!',
        ideaSub: 'Drehpunkt nah an der Kiste: leicht zu drücken, aber die Kiste geht nur ein bisschen hoch. Drehpunkt in der Mitte: schwerer, aber die Kiste geht hoch hinauf.',
        goal: 'Heb die schwere Kiste mit einem Finger.',
        goals: ['Heb die schwere Kiste mit einem Finger. Tipp auf ein Loch, um den Drehpunkt zu versetzen, dann drück das rote Ende nach unten.', 'Diese Kiste ist leicht. Jetzt heb sie hoch hinauf, bis zur Fahne.'],
        prob: {
          heavy: 'Zu schwer! Setz den Drehpunkt näher an die Kiste.', low: 'Die Kiste geht nicht hoch genug. Setz den Drehpunkt weiter weg von der Kiste.', push: 'Jetzt drück das rote Ende mit dem Finger nach unten.',
        },
        winSub: 'Drehpunkt nah an der Last: stark, aber eine kleine Bewegung. Drehpunkt weit weg: eine große Bewegung, aber schwerer. Ingenieure entscheiden!',
        b: ['Bau einen kleinen Ständer: ein Stapel Steine mit einem Pin oben drauf.', 'Leg einen langen Balken auf den Pin. Er kippt wie eine Wippe.', 'Leg ein Spielzeug auf ein Ende. Drück das andere Ende nach unten.', 'Schieb den Balken so, dass der Pin nah am Spielzeug ist. Drück nochmal.'],
        testQ: 'Teste es! Wo ging das Drücken leichter?',
        opts: ['Pin nah am Spielzeug', 'Pin in der Mitte'],
        right: 'Ja! Drehpunkt nah an der Last macht es leicht, aber das Spielzeug geht weniger hoch.', wrong: 'Probier beides nochmal. Wo musst du weniger drücken?',
        tool: 'Neues Werkzeug: Hebel',
      },
      {
        idea: 'Ein drehendes Rad mit einer Stange schiebt etwas hin und her.\nZüge und Motoren funktionieren so!',
        ideaSub: 'Der Pin dreht sich im Kreis. Die Stange schiebt und zieht. Je weiter der Pin von der Mitte weg ist, desto länger schiebt sie.',
        goal: 'Lass die ferne Glocke klingeln. Der Schieber muss sie erreichen.',
        goals: ['Lass die ferne Glocke klingeln. Der Schieber muss sie erreichen.', 'Jetzt lass die nahe Glocke sanft klingeln. Wirf sie nicht um!'],
        prob: {
          pin: 'Steck einen Pin auf das Rad.', on: 'Schalte den Motor an!',
          short: 'Der Schieber erreicht die Glocke nicht. Setz den Pin weiter weg von der Mitte.', long: 'Zu weit! Die Glocke fällt um. Setz den Pin näher an die Mitte.',
        },
        winSub: 'Pin weit weg von der Mitte: ein langer Schub. Pin nah an der Mitte: ein kurzer Schub.',
        b: ['Steck einen kurzen Balken (3 Löcher) auf eine Achse. Das ist die Kurbel.', 'Steck einen Pin in das letzte Loch vom kurzen Balken.', 'Steck einen langen Balken auf den Pin. Das ist die Stange. Ihr anderes Ende rutscht über den Tisch.', 'Dreh die Kurbel. Die Stange schiebt und zieht!'],
        testQ: 'Teste es! Steck den Pin in das mittlere Loch vom kurzen Balken. Bewegt sich die Stange mehr oder weniger?',
        opts: ['Mehr', 'Weniger'],
        right: 'Ja! Pin näher an der Mitte = ein kürzerer Schub.', wrong: 'Schau auf das Ende der Stange. Wie weit geht es jetzt?',
        tool: 'Neues Werkzeug: Schieben und ziehen',
      },
      {
        idea: 'Ein Kran nutzt zwei Werkzeuge gleichzeitig:\neins hebt den Haken, eins hebt den Arm.',
        ideaSub: 'Beide müssen stark sein. Und beide müssen stillhalten, wenn der Motor stoppt, sonst fällt die Last!',
        goal: 'Heb die Kiste bis zur Fahne und den Arm bis zur gestrichelten Linie. Beides muss oben bleiben, wenn du loslässt.',
        prob: {
          hoistEmpty: 'Such ein Werkzeug für den Haken-Motor aus.', boomEmpty: 'Such ein Werkzeug für den Arm-Motor aus.',
          hoistWeak: 'Der Haken-Motor ist zu schwach. Welches Werkzeug macht ihn stark?', boomWeak: 'Der Arm-Motor ist zu schwach. Welches Werkzeug macht ihn stark?',
          hoistFalls: 'Die Kiste rutscht runter, wenn du loslässt! Welches Werkzeug sperrt?', boomFalls: 'Der Arm fällt runter, wenn du loslässt! Welches Werkzeug sperrt?',
          hoistLow: 'Halt den \u25b2-Knopf vom Haken gedrückt, bis die Kiste an der Fahne ist.', boomLow: 'Halt den \u25b2-Knopf vom Arm gedrückt, bis der Arm an der gestrichelten Linie ist.',
        },
        winSub: 'Schnecken machen beide Motoren stark, und sie sperren. Dein Kran hält alles fest!',
        b: ['Bau einen Turm: Stell zwei lange Balken auf eine Grundplatte.', 'Setz deine Schnecken-Seilwinde aus Lektion 7 oben auf den Turm.', 'Bind die Schnur an die Winde. Mach unten einen Haken dran.', 'Dreh die Schnecke. Der Haken geht hoch und bleibt oben!'],
        testQ: 'Teste es! Warum hat ein Kran eine Schnecke?',
        opts: ['Sie sperrt, damit die Last nicht fällt', 'Sie ist das schnellste Zahnrad'],
        right: 'Ja! Die Schnecke hält die Last, auch wenn der Motor stoppt.', wrong: 'Denk an Lektion 7: Was ist passiert, als der Motor gestoppt hat?',
        tool: 'Neue Maschine: Kran',
      },
    ],
  },
};
const MAP = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10], [11, 12, 13, 14, 15]];

// ---------- Lessons ----------
const gearOnAxle = (an, axleId) => an.gs.find((g) => g.axle === axleId) || null;
const firstJam = (an) => { const j = an.pairs.find((x) => x.type === 'jam'); return j ? [j.x, j.y] : null; };
const at = (hx, hy) => [holeX(hx), holeY(hy)];

// Lesson 11 wheel and rod sizes (needed by the lesson data below).
const SLD = { cx: 200, cy: 220, R: 104, rod: 250, pins: { pinNear: 32, pinMid: 64, pinEdge: 96 } };
const LESSONS = [
  { // 1 Fast gears
    stock: { axle: 3, g8: 1, g16: 1, g24: 1, motor: 1 },
    fixed: { axles: [], motor: null },
    ghosts: [{ type: 'axle', hx: 4, hy: 3 }, { type: 'axle', hx: 6, hy: 3 }, { type: 'gear', teeth: 24, hx: 4, hy: 3 }, { type: 'gear', teeth: 8, hx: 6, hy: 3 }, { type: 'motor', hx: 4, hy: 3 }],
    check(p, an) {
      if (!p.axles.length) return 'axle';
      if (!an.gs.some((g) => g.teeth === 24)) return 'big';
      if (!an.gs.some((g) => g.teeth === 8)) return 'small';
      if (!an.motorGear || an.motorGear.teeth !== 24) return 'motor';
      const mi = an.info[an.motorGear.id];
      if (mi.jam) return 'jam';
      const s = an.gs.find((g) => g.teeth === 8 && an.info[g.id].root === mi.root);
      if (!s) return 'touch';
      if (!p.motorOn) return 'on';
      if (Math.abs(Math.abs(an.info[s.id].k) - 3) > 1e-6) return 'ratio';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (prob === 'on') return null;
      return ['small', 'touch', 'ratio'].includes(prob) ? at(6, 3) : at(4, 3);
    },
    idea: { kind: 'pair', a: 24, b: 8, labels: ['1×', '3×'] },
    build: {
      parts: [['beam9', 1], ['axle4', 2], ['g24', 1], ['g8', 1], ['bush', 2]],
      scenes: [
        { hlBeam: true },
        { axles: [1], hl: [[1, 24]] },
        { axles: [1, 3], hl: [[3, 24]] },
        { axles: [3], gears: [[1, 24]], hl: [[1, 96]] },
        { gears: [[1, 24], [3, 8]], hl: [[3, 40]] },
        { gears: [[1, 24], [3, 8]], inset: true },
      ],
      answers: 'numbers', correct: 3,
    },
    badge: 'g8',
  },
  { // 2 Strong gears
    stock: { axle: 2, g8: 1, g16: 1, g24: 1, motor: 1 },
    fixed: { axles: [{ id: 'load', hx: 9, hy: 1, fixed: true, load: true }], motor: null },
    load: 'load',
    ghosts: [{ type: 'axle', hx: 7, hy: 1 }, { type: 'gear', teeth: 24, hx: 9, hy: 1 }, { type: 'gear', teeth: 8, hx: 7, hy: 1 }, { type: 'motor', hx: 7, hy: 1 }],
    check(p, an) {
      const load = gearOnAxle(an, 'load');
      if (!load || load.teeth !== 24) return 'big';
      if (an.motorGear && an.motorGear.id === load.id) return 'weak';
      if (p.axles.length < 2) return 'axle';
      if (!an.gs.some((g) => g.teeth === 8)) return 'small';
      if (!an.motorGear) return 'motor';
      if (an.motorGear.id === load.id) return 'weak';
      if (an.info[an.motorGear.id].jam) return 'jam';
      if (an.info[load.id].root !== an.motorGear.id) return 'touch';
      if (!p.motorOn) return 'on';
      if (an.stall) return 'weak';
      if (an.info[load.id].k * (p.reverse ? -1 : 1) > 0) return 'down';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (prob === 'on' || prob === 'down') return null;
      return ['big', 'weak'].includes(prob) ? at(9, 1) : at(7, 1);
    },
    idea: { kind: 'lift' },
    build: {
      parts: [['beam9', 1], ['axle4', 2], ['g8', 1], ['g24', 1], ['string', 1], ['toy', 1]],
      scenes: [
        { hlBeam: true },
        { axles: [1, 3], hl: [[1, 24], [3, 24]] },
        { axles: [3], gears: [[1, 8]], hl: [[1, 40]] },
        { gears: [[1, 8], [3, 24]], hl: [[3, 96]] },
        { gears: [[1, 8], [3, 24]], string: 3, noNums: true },
        { gears: [[1, 8], [3, 24]], string: 3, table: true, noNums: true },
      ],
      answers: 'choice', icons: ['g8', 'g24'], correct: 0,
    },
    badge: 'g24',
  },
  { // 3 Flip it
    stock: { axle: 1, g8: 1, g16: 1, g24: 3, motor: 0 },
    fixed: { axles: [{ id: 'm', hx: 2, hy: 3, fixed: true }, { id: 'star', hx: 8, hy: 3, fixed: true, star: true }], motor: 'm' },
    ghosts: [{ type: 'gear', teeth: 24, hx: 2, hy: 3 }, { type: 'gear', teeth: 24, hx: 8, hy: 3 }, { type: 'axle', hx: 5, hy: 3 }, { type: 'gear', teeth: 24, hx: 5, hy: 3 }],
    check(p, an) {
      const mg = an.motorGear, star = gearOnAxle(an, 'star');
      if (!mg) return 'motorGear';
      if (!star) return 'starGear';
      if (an.info[mg.id].jam) return 'jam';
      if (an.info[star.id].root !== mg.id) return p.axles.length < 3 ? 'axle' : 'touch';
      if (!p.motorOn) return 'on';
      if (an.info[star.id].k < 0) return 'same';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (prob === 'on') return null;
      if (prob === 'motorGear') return at(2, 3);
      if (prob === 'starGear') return at(8, 3);
      return at(5, 3);
    },
    idea: { kind: 'three' },
    build: {
      parts: [['beam9', 1], ['axle4', 3], ['g24', 3], ['bush', 3]],
      scenes: [
        { hlBeam: true },
        { axles: [0, 3, 6], hl: [[0, 24], [3, 24], [6, 24]] },
        { axles: [3], gears: [[0, 24], [6, 24]], hl: [[0, 96], [6, 96]] },
        { gears: [[0, 24], [3, 24], [6, 24]], hl: [[3, 96]], arrows: true },
        { gears: [[0, 24], [3, 24], [6, 24]], inset: true },
      ],
      answers: 'choice', icons: ['cw', 'ccw'], correct: 0,
    },
    badge: 'g16',
  },
  { // 4 Axles and bushes (top view puzzle)
    type: 'stack', noMotor: true,
    rounds: [['gear', 'beam', 'bush'], ['gear', 'beam', 'beam', 'bush'], ['bush', 'beam', 'gear', 'beam', 'bush']],
    stock: { ax2: 1, ax3: 1, ax4: 1, ax5: 1, ax6: 1 }, reusable: true,
    fixed: { axles: [], motor: null }, ghosts: [],
    check(p) {
      const need = this.rounds[p.round].length;
      if (p.axleLen == null) return 'pick';
      if (p.axleLen < need) return 'short';
      if (p.axleLen > need) return 'long';
      return null;
    },
    target() { return null; },
    idea: { kind: 'stack' },
    build: {
      parts: [['beam9', 2], ['axles', 3], ['g24', 1], ['bush', 1]],
      scenes: [{ measure: true }, { stack: ['gear', 'beam', 'bush'], len: 3 }, { stack: ['gear', 'beam', 'bush'], len: 2 }],
      answers: 'numbers', nums: [2, 3, 4, 5], correct: 4,
    },
    badge: 'ax4',
  },
  { // 5 Gear chain
    stock: { axle: 2, g8: 2, g16: 1, g24: 3, motor: 0 },
    fixed: { axles: [{ id: 'm', hx: 1, hy: 3, fixed: true }, { id: 'star', hx: 9, hy: 3, fixed: true, star: true }], motor: 'm' },
    ghosts: [{ type: 'gear', teeth: 24, hx: 1, hy: 3 }, { type: 'axle', hx: 4, hy: 3 }, { type: 'gear', teeth: 24, hx: 4, hy: 3 }, { type: 'axle', hx: 7, hy: 3 }, { type: 'gear', teeth: 24, hx: 7, hy: 3 }, { type: 'gear', teeth: 8, hx: 9, hy: 3 }],
    check(p, an) {
      const mg = an.motorGear, star = gearOnAxle(an, 'star');
      if (!mg) return 'motorGear';
      if (!star) return 'starGear';
      if (an.info[mg.id].jam) return 'jam';
      if (an.info[star.id].root !== mg.id) return p.axles.length < 4 ? 'axle' : 'touch';
      if (!p.motorOn) return 'on';
      if (Math.abs(Math.abs(an.info[star.id].k) - 3) > 1e-6) return 'ratio';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (prob === 'on') return null;
      if (prob === 'motorGear' || prob === 'ratio') return at(1, 3);
      if (prob === 'starGear') return at(9, 3);
      return at(4, 3);
    },
    idea: { kind: 'chain' },
    build: {
      parts: [['beam9', 1], ['axle4', 4], ['g24', 3], ['g8', 1], ['bush', 4]],
      scenes: [
        { hlBeam: true },
        { axles: [0, 3, 6, 8], hl: [[0, 24], [3, 24], [6, 24], [8, 24]] },
        { axles: [8], gears: [[0, 24], [3, 24], [6, 24]], hl: [[0, 96], [3, 96], [6, 96]] },
        { gears: [[0, 24], [3, 24], [6, 24], [8, 8]], hl: [[8, 40]] },
        { gears: [[0, 24], [3, 24], [6, 24], [8, 8]], inset: true },
      ],
      answers: 'numbers', correct: 3,
    },
    badge: 'g24',
  },
  { // 6 Crank and winch
    noMotor: true, guided: false, strength: 1.9, liftRate: 22,
    stock: { axle: 1, g8: 1, g16: 1, g24: 1, motor: 0, crankS: 1, crankL: 1 },
    fixed: { axles: [{ id: 'load', hx: 6, hy: 1, fixed: true, load: true }], motor: null },
    load: 'load',
    ghosts: [{ type: 'crank', hx: 6, hy: 1, len: 2 }],
    check(p, an) {
      if (!p.crank) return 'crank';
      const gc = gearOnAxle(an, p.crank.axle), gl = an.loadGear;
      if (!gc || !gl) return 'touch';
      if (an.info[gc.id].jam) return 'jam';
      if (an.info[gc.id].root !== an.info[gl.id].root) return 'touch';
      if (!canTurn(an, gc)) return 'heavy';
      if (p.lift < MAX_LIFT - 2) return 'turn';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (prob === 'turn') return null;
      if (prob === 'touch') return at(4, 1);
      return at(6, 1);
    },
    idea: { kind: 'crank' },
    build: {
      parts: [['l2build', 1], ['beam3', 1], ['pin', 1]],
      scenes: [
        { gears: [[1, 8], [3, 24]], string: 3, noNums: true },
        { gears: [[1, 8], [3, 24]], string: 3, noNums: true, crank: { hole: 1, hl: 'arm' } },
        { gears: [[1, 8], [3, 24]], string: 3, noNums: true, crank: { hole: 1, hl: 'pin' } },
        { gears: [[1, 8], [3, 24]], string: 3, stringLen: 50, noNums: true, crank: { hole: 1, turn: true } },
      ],
      answers: 'choice', icons: ['near', 'far'], correct: 1,
    },
    badge: 'crankL',
  },
  { // 7 Worm gear
    guided: false, gravity: true, liftRate: 120, motorSpeed: 4, drum: 18,
    stock: { axle: 1, g8: 1, g24: 1, worm: 1, motor: 1 },
    fixed: { axles: [{ id: 'load', hx: 8, hy: 1, fixed: true, load: true }], motor: null },
    load: 'load',
    ghosts: [{ type: 'worm', hx: 6, hy: 1 }, { type: 'gear', teeth: 24, hx: 8, hy: 1 }, { type: 'motor', hx: 6, hy: 1 }],
    check(p, an) {
      const load = an.loadGear;
      if (!load || load.teeth !== 24) return 'big';
      if (!an.motorGear) return 'motor';
      if (an.info[an.motorGear.id].jam) return 'jam';
      if (an.info[load.id].root !== an.motorGear.id) return 'touch';
      if (an.stall) return 'weak';
      if (p.lift < MAX_LIFT - 2) return p.fellBack ? 'falls' : 'lift';
      if (p.motorOn) return 'off';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (['lift', 'off'].includes(prob)) return null;
      return prob === 'big' ? at(8, 1) : at(6, 1);
    },
    idea: { kind: 'worm' },
    build: {
      parts: [['worm', 1], ['g24', 1], ['axle4', 2]],
      scenes: [
        { noBeam: true, worm: 3, hl: [[3, 50]] },
        { noBeam: true, worm: 0, gears: [[4, 24]] },
        { noBeam: true, worm: 1, gears: [[3, 24]], hl: [[1, 50]] },
        { noBeam: true, worm: 1, gears: [[3, 24]], arrows: true },
      ],
      answers: 'choice', icons: ['worm', 'lock'], correct: 1,
    },
    badge: 'worm',
  },
  { // 8 Up and down (rack and pinion)
    guided: false, motorDir: -1, rack: { x: holeX(8) + 28 },
    stock: { axle: 2, g8: 1, g16: 1, g24: 1, motor: 1 },
    fixed: { axles: [], motor: null },
    ghosts: [{ type: 'axle', hx: 8, hy: 4 }, { type: 'gear', teeth: 8, hx: 8, hy: 4 }, { type: 'motor', hx: 8, hy: 4 }],
    check(p, an) {
      const rg = an.loadGear;
      if (!rg) return 'pinion';
      if (!an.motorGear) return 'motor';
      if (an.info[rg.id].jam) return 'jam';
      if (an.info[rg.id].root !== an.motorGear.id) return 'touch';
      if (!p.motorOn) return 'on';
      if (p.lift < MAX_LIFT - 2) return 'lift';
      return null;
    },
    target(prob, an) {
      if (prob === 'jam') return firstJam(an);
      if (prob === 'on' || prob === 'lift') return null;
      return at(8, 4);
    },
    idea: { kind: 'rack' },
    build: {
      parts: [['rack', 1], ['g8', 1], ['axle4', 1]],
      scenes: [
        { noBeam: true, rack: 3, hl: [[3.5, 60]] },
        { noBeam: true, gears: [[1, 8]], hl: [[1, 40]] },
        { noBeam: true, rack: 3, gears: [[3, 8]], hl: [[3, 44]] },
        { noBeam: true, rack: 3, rackUp: 40, gears: [[3, 8]], arrows: true, ccw: true },
      ],
      answers: 'choice', icons: ['slide', 'spin'], correct: 0,
    },
    badge: 'rack',
  },
  { // 9 Turn a corner (bevel gears, top view)
    type: 'corner', noMotor: true, guided: false,
    rounds: [{ same: true }, { faster: true }],
    stock: { g24: 1, b12: 1, b20: 1 }, reusable: true,
    fixed: { axles: [], motor: null }, ghosts: [],
    check(p) {
      if (!p.slotA || !p.slotB) return 'empty';
      if (p.slotA === 'g24' || p.slotB === 'g24') return 'flat';
      if (p.round === 0 && p.slotA !== p.slotB) return 'size';
      if (p.round === 1 && !(p.slotA === 'b20' && p.slotB === 'b12')) return 'faster';
      return null;
    },
    target() { return null; },
    idea: { kind: 'corner' },
    build: {
      parts: [['b12', 2], ['axle4', 2]],
      scenes: [{ corner: ['b12', 'b12'], noAxles: true }, { corner: ['b12', 'b12'] }, { corner: ['b12', 'b12'], hlMeet: true }, { corner: ['b12', 'b12'], spin: true }],
      answers: 'numbers', correct: 1,
    },
    badge: 'b20',
  },
  { // 10 Levers
    type: 'lever', noMotor: true, rounds: [{ w: 3, flag: 20 }, { w: 1, flag: 90 }],
    stock: { pivot: 1 }, reusable: true, fixed: { axles: [], motor: null }, ghosts: [],
    check(p) {
      const r = this.rounds[p.round], pv = p.pivot;
      if ((r.w * pv) / (10 - pv) > 1.001) return 'heavy';
      if (pv * U * Math.sin(LEV.maxA) < r.flag) return 'low';
      if (!p.reached) return 'push';
      return null;
    },
    target() { return null; },
    drop(p, kind, x) { if (x == null) { toast(t().tapPivot); return false; } const h = Math.round((x - LEV.x0) / U); if (h >= 1 && h <= 9) setPivot(p, h); return true; },
    draw: (p, o) => leverSVG(p, o),
    resetRound(p) { p.pivot = 5; p.levA = 0; p.reached = false; },
    tick(p, dt) { if (!p.levDrag && p.levA > 0) { p.levA = Math.max(0, p.levA - 1.4 * dt); drawBoard(); } },
    idea: { kind: 'lever' },
    build: {
      parts: [['beam9', 1], ['pin', 1], ['toy', 1]],
      scenes: [{ svg: () => leverSVG({ pivot: 5, levA: 0, round: 0, helpers: false }, { stand: true, onlyStand: true }) }, { svg: () => leverSVG({ pivot: 5, levA: 0.2, round: 0, helpers: false }, { noBox: true }) }, { svg: () => leverSVG({ pivot: 5, levA: 0.3, round: 0, helpers: false }, { push: true }) }, { svg: () => leverSVG({ pivot: 2, levA: 0.35, round: 0, helpers: true }, { push: true }) }],
      answers: 'choice', icons: ['leverNear', 'leverMid'], correct: 0,
    },
    badge: 'leverNear',
  },
  { // 11 Push and pull (crank and rod)
    type: 'slider', rounds: [{ bell: SLD.cx + SLD.pins.pinEdge + SLD.rod + 20 }, { bell: SLD.cx + SLD.pins.pinNear + SLD.rod + 20 }],
    stock: { pinNear: 1, pinMid: 1, pinEdge: 1 }, reusable: true, fixed: { axles: [], motor: null }, ghosts: [],
    check(p) {
      if (!p.pinR) return 'pin';
      if (!p.motorOn) return 'on';
      const reach = SLD.cx + p.pinR + SLD.rod + 20, bell = this.rounds[p.round].bell;
      if (reach < bell - 3) return 'short';
      if (reach > bell + 3) return 'long';
      return null;
    },
    target() { return null; },
    drop(p, kind) { p.pinR = SLD.pins[kind]; p.pinKind = kind; p.bellDown = false; return true; },
    draw: (p, o) => sliderSVG(p, o),
    resetRound(p) { p.pinR = null; p.pinKind = null; p.bellDown = false; p.motorOn = false; },
    tick(p, dt) {
      if (p.motorOn) p.theta += 2.2 * dt;
      p.ring = Math.max(0, (p.ring || 0) - dt);
      if (p.pinR) {
        const sx = sliderX(p.pinR, p.theta), bell = LS().rounds[p.round].bell;
        if (sx + 20 >= bell - 3 && p.motorOn) { if (sx + 20 > bell + 3) p.bellDown = true; else p.ring = 0.6; }
      }
      drawBoard();
    },
    idea: { kind: 'slider' },
    build: {
      parts: [['beam3', 1], ['beam9', 1], ['axle4', 1], ['pin', 2]],
      scenes: [{ svg: () => sliderSVG({ pinR: null, theta: -0.5, round: 0 }, { bare: true, noRod: true }) }, { svg: () => sliderSVG({ pinR: SLD.pins.pinEdge, theta: -0.5, round: 0 }, { bare: true, noRod: true, hlPin: true }) }, { svg: () => sliderSVG({ pinR: SLD.pins.pinEdge, theta: -0.5, round: 0 }, { bare: true, hlRod: true }) }, { svg: () => sliderSVG({ pinR: SLD.pins.pinEdge, theta: -0.5, round: 0 }, { bare: true, spin: true }) }],
      answers: 'choice', icons: ['more', 'less'], correct: 1,
    },
    badge: 'pinEdge',
  },
  { // 12 Crane (machine)
    type: 'machine', noMotor: true, holds: ['hoist', 'boom'],
    stock: { tFast: 1, tStrong: 1, tWorm: 1, tRack: 1 }, reusable: true, fixed: { axles: [], motor: null }, ghosts: [],
    check(p) {
      for (const f of ['hoist', 'boom']) if (!p.slots[f]) return f + 'Empty';
      for (const f of ['hoist', 'boom']) if (TOOLS[p.slots[f]].strength < 2) return f + 'Weak';
      for (const f of ['hoist', 'boom']) if (!TOOLS[p.slots[f]].lock) return f + 'Falls';
      if (p.val.hoist < 0.95) return 'hoistLow';
      if (p.val.boom < 0.95) return 'boomLow';
      return null;
    },
    target() { return null; },
    drop(p, kind, x, y) {
      const f = y == null ? (!p.slots.hoist ? 'hoist' : 'boom') : (y < (CRN.hookBox[1] + CRN.armBox[1]) / 2 + 30 ? 'hoist' : 'boom');
      p.slots[f] = kind; return true;
    },
    draw: (p, o) => craneSVG(p, o),
    tick(p, dt) {
      for (const f of ['hoist', 'boom']) {
        const tool = p.slots[f] ? TOOLS[p.slots[f]] : null, held = p.hold && p.hold.f === f;
        p.shake[f] = false;
        if (held && tool) {
          if (tool.strength < 2 && p.hold.dir > 0) { p.shake[f] = true; if (!p.hold.warned) { p.hold.warned = true; toast(t().weakPress); } }
          else p.val[f] = Math.max(0, Math.min(1, p.val[f] + p.hold.dir * tool.rate * dt));
        } else if ((!tool || !tool.lock) && p.val[f] > 0) p.val[f] = Math.max(0, p.val[f] - 0.45 * dt);
      }
      drawBoard();
    },
    idea: { kind: 'crane' },
    build: {
      parts: [['beam9', 2], ['worm', 1], ['g24', 1], ['string', 1]],
      scenes: [{ svg: () => craneSVG({ slots: {}, val: { hoist: 0, boom: 0.4 }, shake: {} }, { bare: true, noBoom: true, noRope: true }) }, { svg: () => craneSVG({ slots: {}, val: { hoist: 0, boom: 0.4 }, shake: {} }, { bare: true, noRope: true, hlTop: true }) }, { svg: () => craneSVG({ slots: {}, val: { hoist: 0, boom: 0.4 }, shake: {} }, { bare: true }) }, { svg: () => craneSVG({ slots: {}, val: { hoist: 0.7, boom: 0.4 }, shake: {} }, { bare: true, upArrow: true }) }],
      answers: 'choice', icons: ['lock', 'tFast'], correct: 0,
    },
    badge: 'crane',
  },
];
// Can a hand (or crank) turn gear g with the heavy box on it?
const liftRate = (an) => (LS().rack && an.loadGear ? an.loadGear.r : LS().liftRate || LIFT_PER_RAD);
function canTurn(an, g) {
  if (an.info[g.id] && an.info[g.id].locked && !g.worm) return false;
  if (!an.loadGear || !LS().load) return true;
  const inf = an.info[g.id], il = an.info[an.loadGear.id];
  if (!inf || inf.root !== il.root) return true;
  const p = S.play, lever = p.crank && p.crank.axle === g.axle ? p.crank.len : 1;
  return lever * Math.abs(inf.k / il.k) >= (LS().strength || STRENGTH_NEEDED);
}

// ---------- Saved progress (browser only) ----------
const SAVE_KEY = 'brickl.v1';
function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; } }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ lang: S.lang, done: S.done })); } catch (e) { /* storage blocked */ } }

function newPlay(li) {
  const L = LESSONS[li];
  return {
    axles: L.fixed.axles.map((a) => ({ ...a })), gears: [], motor: L.fixed.motor, motorFixed: !!L.fixed.motor,
    motorOn: false, reverse: false, helpers: true, sel: null, ang: {}, phis: {}, nextId: 1, lift: 0, prevLoad: null, warned: false, round: 0, axleLen: null, crank: null, atFlag: false, fellBack: false, slotA: null, slotB: null, pivot: 5, levA: 0, levDrag: false, reached: false, pinR: null, pinKind: null, theta: 0, ring: 0, bellDown: false, slots: { hoist: null, boom: null }, val: { hoist: 0, boom: 0 }, hold: null, shake: {},
  };
}

const saved = load();
const S = {
  lang: saved.lang === 'de' ? 'de' : 'en',
  done: Array.isArray(saved.done) ? saved.done : [],
  screen: 'map', li: 0, step: 0, play: null, an: null,
  fails: 0, hintLevel: 0, panel: null, toast: null, win: false,
  build: { i: 0, have: {}, answer: null },
};
const t = () => T[S.lang];
const tl = () => T[S.lang].L[S.li];
const LS = () => LESSONS[S.li];

// ---------- Small SVG pieces ----------
function gearSVG(teeth, opts = {}) {
  const r = radius(teeth), [fill, dk, light] = GEAR_COL[teeth];
  if (opts.ghost) return `<path d="${gearPath(teeth, r)}" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="7 6" opacity=".45"/>`;
  const holes = teeth >= 24 ? [0, 1, 2].map((i) => { const a = (i * TAU) / 3 - Math.PI / 2; return `<circle cx="${(r * 0.45 * Math.cos(a)).toFixed(1)}" cy="${(r * 0.45 * Math.sin(a)).toFixed(1)}" r="${(r * 0.11).toFixed(1)}" fill="${light}"/>`; }).join('') : '';
  return `<path d="${gearPath(teeth, r)}" fill="${fill}" stroke="${dk}" stroke-width="2.5" stroke-linejoin="round"/>${holes}` +
    `<circle r="${Math.max(9, r * 0.17).toFixed(1)}" fill="${light}"/>${axleCross(Math.max(6.5, r * 0.11))}` +
    `<circle cx="${(r * 0.72).toFixed(1)}" cy="0" r="${Math.max(4, r * 0.075).toFixed(1)}" fill="#fff" stroke="${dk}" stroke-width="1.5"/>`;
}
const axleCross = (s) => `<path d="M${-s},${-s * 0.28} H${s} V${s * 0.28} H${-s}Z M${-s * 0.28},${-s} H${s * 0.28} V${s} H${-s * 0.28}Z" fill="#1F2430"/>`;
const axleEnd = () => `<circle r="12" fill="#5B6270"/>${axleCross(8)}`;
const motorBadge = (shake) => `<g class="${shake ? 'shake' : ''}"><rect x="-26" y="14" width="52" height="24" rx="8" fill="#1F2430"/><path d="M-6 18l-6 9h6l-3 7 10-11h-6l3-5z" fill="#F2A33A"/><text x="10" y="31" font-size="13" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">M</text></g>`;
const starPath = (r) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, R = i % 2 ? r * 0.45 : r; p.push((R * Math.cos(a)).toFixed(1) + ',' + (R * Math.sin(a)).toFixed(1)); } return 'M' + p.join('L') + 'Z'; };
const starBadge = () => `<g><rect x="-20" y="14" width="40" height="26" rx="9" fill="#1F2430"/><path d="${starPath(10)}" transform="translate(0 27)" fill="#F2C94C"/></g>`;
// Curved direction arrow around a gear (cw = clockwise).
function dirArrow(R, cw, col) {
  const a0 = (-128 * Math.PI) / 180, a1 = (-52 * Math.PI) / 180;
  const x0 = R * Math.cos(a0), y0 = R * Math.sin(a0), x1 = R * Math.cos(a1), y1 = R * Math.sin(a1);
  return `<g transform="scale(${cw ? 1 : -1} 1)"><path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/><path d="M${(x1 + 9).toFixed(1)},${(y1 + 2).toFixed(1)} L${(x1 - 5).toFixed(1)},${(y1 - 6).toFixed(1)} L${(x1 - 3).toFixed(1)},${(y1 + 9).toFixed(1)}Z" fill="${col}"/></g>`;
}
const crankArm = (Lp, hlPin) => `<rect x="-13" y="-13" width="${Lp + 26}" height="26" rx="13" fill="#5B6270" stroke="#1F2430" stroke-width="2"/><circle r="7" fill="#1F2430"/><circle cx="${Lp}" cy="0" r="15" fill="#C93C3C" stroke="#fff" stroke-width="3"/>`;
const crate = (w = 64, h = 60, label = '50') => `<rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="6" fill="#B5793C" stroke="#7A4D20" stroke-width="3"/><path d="M${-w / 2 + 6},6 L${w / 2 - 6},${h - 6} M${w / 2 - 6},6 L${-w / 2 + 6},${h - 6}" stroke="#7A4D20" stroke-width="3"/><rect x="-17" y="${h / 2 - 11}" width="34" height="22" rx="5" fill="#1F2430"/><text y="${h / 2 + 5}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${label}</text>`;

function icon(kind, w = 56, h = 44) {
  if (kind === 'axle') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="4" y="19" width="48" height="7" rx="2" fill="#1F2430"/><rect x="4" y="15" width="5" height="15" rx="1.5" fill="#1F2430"/></svg>`;
  if (kind === 'motor') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="4" y="8" width="38" height="28" rx="7" fill="#5B6270"/><rect x="42" y="18" width="11" height="8" rx="2" fill="#1F2430"/><path d="M22 13l-6 9h6l-3 8 10-11h-6l3-6z" fill="#F2A33A"/></svg>`;
  if (kind === 'bush') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="14" y="8" width="28" height="28" rx="6" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/><g transform="translate(28 22)">${axleCross(7)}</g></svg>`;
  if (kind === 'beam9') return `<svg width="${w * 2}" height="${h}" viewBox="0 0 120 44" aria-hidden="true"><rect x="2" y="10" width="116" height="24" rx="12" fill="#3A4150"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${14 + i * 11.5}" cy="22" r="4.2" fill="#FAF8F3"/>`).join('')}</svg>`;
  if (kind === 'axle4') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="6" y="18" width="44" height="8" rx="2" fill="#1F2430"/>${[1, 2, 3].map((i) => `<rect x="${6 + i * 11 - 0.75}" y="18" width="1.5" height="8" fill="#5B6270"/>`).join('')}</svg>`;
  if (kind === 'string') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><path d="M6 30 C16 6, 26 40, 36 16 S50 20, 50 10" fill="none" stroke="#7A4D20" stroke-width="3" stroke-linecap="round"/></svg>`;
  if (kind === 'toy') return `<svg width="${w}" height="${h}" viewBox="-32 -6 64 72" aria-hidden="true">${crate(52, 50)}</svg>`;
  if (kind === 'cw' || kind === 'ccw') return `<svg width="${w}" height="${h}" viewBox="-40 -40 80 80" aria-hidden="true"><circle r="16" fill="#F2A33A" stroke="#B86E0F" stroke-width="3"/><g transform="translate(0 8)">${dirArrow(28, kind === 'cw', '#1F2430')}</g></svg>`;
  if (/^ax\d$/.test(kind)) { const n = +kind[2]; return `<svg width="${w}" height="${h}" viewBox="0 0 66 44" aria-hidden="true"><rect x="3" y="18" width="${n * 10}" height="8" rx="2" fill="#1F2430"/>${Array.from({ length: n - 1 }, (_, i) => `<rect x="${3 + (i + 1) * 10 - 0.75}" y="18" width="1.5" height="8" fill="#9AA3B2"/>`).join('')}<text x="${n * 10 + 8}" y="27" font-size="13" font-weight="800" fill="#1F2430" font-family="Nunito, sans-serif">${n}</text></svg>`; }
  if (kind === 'worm') return `<svg width="${w}" height="${h}" viewBox="-28 -22 56 44" aria-hidden="true"><g transform="rotate(90)">${wormBody(0, 'iw' + Math.random().toString(36).slice(2, 7))}</g></svg>`;
  if (kind === 'b12' || kind === 'b20') { const s = kind === 'b12' ? 12 : 18; return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><path d="M${28 - s},12 L${28 + s},12 L${28 + s - 8},32 L${28 - s + 8},32Z" fill="#8FBF4A" stroke="#5B8A2A" stroke-width="2"/><rect x="25" y="8" width="6" height="28" rx="2" fill="#1F2430"/></svg>`; }
  if (kind === 'rack') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="6" y="20" width="44" height="12" rx="2" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${9 + i * 7},20 l3,-6 l3,6Z" fill="#9AA3B2" stroke="#5B6270" stroke-width="1.5"/>`).join('')}</svg>`;
  if (kind === 'lock') return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="#F2A33A" stroke="#1F2430" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#1F2430" stroke-width="2"/></svg>`;
  if (kind === 'slide') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="24" y="6" width="10" height="32" rx="2" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/><path d="M44 12v20M40 16l4-5 4 5M40 28l4 5 4-5" fill="none" stroke="#1F2430" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if (kind === 'spin') return `<svg width="${w}" height="${h}" viewBox="-28 -22 56 44" aria-hidden="true"><rect x="-5" y="-16" width="10" height="32" rx="2" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/><g transform="translate(0 4)">${dirArrow(20, true, '#1F2430')}</g></svg>`;
  if (kind === 'pivot') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><path d="M28,12 L14,38 L42,38Z" fill="#5B6270" stroke="#1F2430" stroke-width="2"/><circle cx="28" cy="12" r="6" fill="#F2A33A" stroke="#1F2430" stroke-width="2"/></svg>`;
  if (kind === 'leverNear' || kind === 'leverMid') { const px = kind === 'leverNear' ? 16 : 28; return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="4" y="18" width="48" height="8" rx="4" fill="#3A4150" transform="rotate(-10 ${px} 22)"/><path d="M${px},24 L${px - 7},38 L${px + 7},38Z" fill="#5B6270"/><rect x="4" y="6" width="12" height="10" rx="2" fill="#B5793C"/></svg>`; }
  if (/^pin(Near|Mid|Edge)$/.test(kind)) { const r = { pinNear: 5, pinMid: 10, pinEdge: 15 }[kind]; return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><circle cx="28" cy="22" r="19" fill="#F2A33A" stroke="#B86E0F" stroke-width="2"/><circle cx="28" cy="22" r="3" fill="#1F2430"/><circle cx="${28 + r}" cy="22" r="4.5" fill="#C93C3C" stroke="#fff" stroke-width="1.5"/></svg>`; }
  if (kind === 'more' || kind === 'less') { const l = kind === 'more' ? 40 : 18; return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><path d="M${28 - l / 2},22 h${l} M${28 - l / 2 + 6},16 l-6,6 l6,6 M${28 + l / 2 - 6},16 l6,6 l-6,6" fill="none" stroke="#1F2430" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
  if (kind === 'tFast') return `<svg width="${w}" height="${h}" viewBox="-48 -40 150 80" aria-hidden="true"><g transform="scale(.6)">${gearSVG(24)}</g><g transform="translate(${(radius(24) + radius(8)) * 0.6} 0) scale(.6)">${gearSVG(8)}</g></svg>`;
  if (kind === 'tStrong') return icon('l2build', w, h);
  if (kind === 'tWorm') return icon('worm', w, h);
  if (kind === 'tRack') return icon('rack', w, h);
  if (kind === 'crane') return `<svg width="${w}" height="${h}" viewBox="0 0 56 56" aria-hidden="true"><path d="M14 52V12h4v40zM14 12l34 6" fill="none" stroke="#B86E0F" stroke-width="4"/><path d="M44 17v18" stroke="#7A4D20" stroke-width="2"/><rect x="38" y="35" width="12" height="10" rx="2" fill="#B5793C"/></svg>`;
  if (kind === 'axles') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="6" y="8" width="20" height="6" rx="2" fill="#1F2430"/><rect x="6" y="19" width="32" height="6" rx="2" fill="#1F2430"/><rect x="6" y="30" width="44" height="6" rx="2" fill="#1F2430"/></svg>`;
  if (kind === 'beam3') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="4" y="12" width="48" height="20" rx="10" fill="#3A4150"/>${[0, 1, 2].map((i) => `<circle cx="${14 + i * 14}" cy="22" r="4.5" fill="#FAF8F3"/>`).join('')}</svg>`;
  if (kind === 'pin') return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="10" y="17" width="36" height="10" rx="4" fill="#1F2430"/><rect x="26" y="14" width="4" height="16" rx="1" fill="#1F2430"/></svg>`;
  if (kind === 'l2build') return `<svg width="${w}" height="${h}" viewBox="-40 -48 150 96" aria-hidden="true">${gearSVG(8)}<g transform="translate(${radius(8) + radius(24)} 0) scale(.6)">${gearSVG(24)}</g></svg>`;
  if (kind === 'crankS' || kind === 'crankL' || kind === 'near' || kind === 'far') {
    const len = kind === 'crankS' ? 22 : 44, hand = kind === 'near' ? 12 : kind === 'far' ? 44 : null;
    return `<svg width="${w}" height="${h}" viewBox="0 0 56 44" aria-hidden="true"><rect x="2" y="16" width="${len + 10}" height="12" rx="6" fill="#5B6270"/><circle cx="8" cy="22" r="3" fill="#1F2430"/><circle cx="${len + 6}" cy="22" r="6" fill="#C93C3C"/>${hand ? `<circle cx="${hand}" cy="22" r="9" fill="none" stroke="#F2A33A" stroke-width="3"/>` : ''}</svg>`;
  }
  const teeth = +kind.slice(1);
  const r = radius(teeth), s = r + r * 0.1 + 4;
  return `<svg width="${w}" height="${h}" viewBox="${-s} ${-s} ${2 * s} ${2 * s}" aria-hidden="true">${gearSVG(teeth)}</svg>`;
}

// ---------- Worm gear (upright, side view) ----------
function wormBody(phase, cid) {
  const off = (((phase / TAU) * 14) % 14 + 14) % 14;
  let threads = '';
  for (let y = -60; y < 60; y += 14) threads += `<path d="M-20,${y} L20,${y + 7}" stroke="#5B6270" stroke-width="3" stroke-linecap="round"/>`;
  return `<rect x="-5" y="-50" width="10" height="100" rx="2" fill="#1F2430"/><clipPath id="${cid}"><rect x="-19" y="-36" width="38" height="72" rx="8"/></clipPath>
    <rect x="-19" y="-36" width="38" height="72" rx="8" fill="#C7CDD6" stroke="#5B6270" stroke-width="2"/><g clip-path="url(#${cid})"><g class="wthreads" transform="translate(0 ${off.toFixed(1)})">${threads}</g></g>`;
}

// ---------- Corner with bevel gears (top view, lesson 9) ----------
const CORNER_SIZE = { b12: 42, b20: 66, g24: 78 };
function cornerSVG(A, B, o = {}) {
  const L = t(), cy = 290, ax = 470, sA = A ? CORNER_SIZE[A] : 50, sB = B ? CORNER_SIZE[B] : 50;
  const fanX = ax + 8 + sB, by = cy - sA - 18, ok = A && B && A !== 'g24' && B !== 'g24';
  const txt = (x, y, str, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="16" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${esc(str)}</text>`;
  let s = '';
  // motor and its axle (left), fan axle (up)
  s += `<g transform="translate(120 ${cy})"><rect x="-50" y="-34" width="100" height="68" rx="12" fill="#5B6270"/><path d="M-4 -18l-10 16h10l-5 14 16-19h-10l5-11z" fill="#F2A33A"/></g>${txt(120, cy + 60, L.motorLbl)}`;
  if (!o.noAxles) {
    s += `<line x1="170" y1="${cy}" x2="${ax + 6}" y2="${cy}" stroke="#1F2430" stroke-width="12"/><line id="c-axA" x1="170" y1="${cy}" x2="${ax + 6}" y2="${cy}" stroke="#9AA3B2" stroke-width="4" stroke-dasharray="10 14"/>`;
    s += `<line x1="${fanX}" y1="${by + 8}" x2="${fanX}" y2="70" stroke="#1F2430" stroke-width="12"/><line id="c-axB" x1="${fanX}" y1="${by + 8}" x2="${fanX}" y2="70" stroke="#9AA3B2" stroke-width="4" stroke-dasharray="10 14"/>`;
    s += `<g transform="translate(${fanX} 62)"><g id="c-prop"><rect x="-70" y="-8" width="140" height="16" rx="8" fill="#3E7BEA" stroke="#1F55B5" stroke-width="2"/></g><circle r="9" fill="#1F2430"/></g>${txt(fanX + 90, 66, L.fan, 'start')}`;
  }
  // gear A (on the motor axle, edge-on, upright) and gear B (on the fan axle, edge-on, lying)
  const col = (k) => (k === 'g24' ? ['#F2A33A', '#B86E0F'] : ['#8FBF4A', '#5B8A2A']);
  if (A) { const [f, st] = col(A); s += `<g data-cslot="A" style="cursor:pointer">` + (A === 'g24' ? `<rect x="${ax - 10}" y="${cy - sA}" width="16" height="${2 * sA}" rx="3" fill="${f}" stroke="${st}" stroke-width="2"/>` : `<path d="M${ax - 12},${cy - sA} L${ax + 6},${cy - sA + 16} L${ax + 6},${cy + sA - 16} L${ax - 12},${cy + sA}Z" fill="${f}" stroke="${st}" stroke-width="2"/>`) + `</g>`; }
  else s += `<rect x="${ax - 12}" y="${cy - 50}" width="18" height="100" rx="4" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="6 5" opacity=".45"/>`;
  if (B) { const [f, st] = col(B); s += `<g data-cslot="B" style="cursor:pointer">` + (B === 'g24' ? `<rect x="${fanX - sB}" y="${by}" width="${2 * sB}" height="16" rx="3" fill="${f}" stroke="${st}" stroke-width="2"/>` : `<path d="M${fanX - sB},${by} L${fanX + sB},${by} L${fanX + sB - 16},${by + 18} L${fanX - sB + 16},${by + 18}Z" fill="${f}" stroke="${st}" stroke-width="2"/>`) + `</g>`; }
  else s += `<rect x="${fanX - 50}" y="${by}" width="100" height="18" rx="4" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="6 5" opacity=".45"/>`;
  if (o.hlMeet || o.blink) s += `<circle cx="${ax + 10}" cy="${by + 18}" r="34" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="${o.blink ? 'blink' : 'pulse'}"/>`;
  if (A && B && !ok) s += `<g transform="translate(${ax + 12} ${by + 10})"><circle r="15" fill="#C93C3C" stroke="#fff" stroke-width="3"/><text y="7" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">!</text></g>`;
  if (ok && o.labels) {
    const ratio = (A === 'b20' ? 20 : 12) / (B === 'b20' ? 20 : 12);
    s += `<g transform="translate(${fanX + 90} 100)"><rect x="0" y="-16" width="70" height="30" rx="9" fill="#1F2430"/><text x="35" y="5" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${fmtSpeed(ratio)}</text></g>`;
    s += `<g transform="translate(120 ${cy - 52})"><rect x="-35" y="-16" width="70" height="30" rx="9" fill="#1F2430"/><text y="5" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">1\u00d7</text></g>`;
  }
  return s;
}
let cornerA = 0;
function tickCorner(dt, A, B) {
  const ok = A && B && A !== 'g24' && B !== 'g24';
  if (!ok) return;
  cornerA += dt * MOTOR_SPEED;
  const ratio = (A === 'b20' ? 20 : 12) / (B === 'b20' ? 20 : 12);
  const a = document.getElementById('c-axA'), b = document.getElementById('c-axB'), pr = document.getElementById('c-prop');
  if (a) a.setAttribute('stroke-dashoffset', (-cornerA * 8).toFixed(1));
  if (b) b.setAttribute('stroke-dashoffset', (cornerA * 8 * ratio).toFixed(1));
  if (pr) pr.setAttribute('transform', `scale(${Math.cos(cornerA * ratio).toFixed(3)} 1)`);
}

// ---------- Lever (lesson 10) ----------
const LEV = { x0: 120, y: 250, maxA: 0.42 };
function setPivot(p, h) { p.pivot = h; p.levA = 0; p.reached = false; }
function leverSVG(p, o = {}) {
  const L = t(), pv = p.pivot, a = p.levA || 0, { x0, y } = LEV, px = x0 + pv * U, ground = y + 110;
  const r = (LESSONS[9].rounds || [])[p.round || 0] || { w: 3, flag: 20 };
  const deg = (a * 180) / Math.PI, boxH = 54;
  let s = `<rect x="20" y="${ground}" width="744" height="8" rx="4" fill="#CFC8BA"/>`;
  s += `<path d="M${px},${y + 14} L${px - 40},${ground} L${px + 40},${ground}Z" fill="#5B6270" stroke="#1F2430" stroke-width="2"/>`;
  if (o.onlyStand) return s + `<circle cx="${px}" cy="${y}" r="9" fill="#1F2430"/><circle cx="${px}" cy="${y}" r="26" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  // flag line for the box top
  if (!o.noBox && !o.bare) {
    const fy = y - 14 - boxH - r.flag;
    s += `<line x1="40" y1="${fy}" x2="${x0 + 50}" y2="${fy}" stroke="#1E8A4C" stroke-width="3" stroke-dasharray="8 6"/><line x1="44" y1="${fy - 40}" x2="44" y2="${ground}" stroke="#1F2430" stroke-width="4"/><path d="M46,${fy - 40} L86,${fy - 28} L46,${fy - 16}Z" fill="#1E8A4C"/>`;
  }
  // beam (tips around the pivot)
  s += `<g transform="rotate(${deg.toFixed(2)} ${px} ${y})"><rect x="${x0 - 26}" y="${y - 20}" width="${10 * U + 52}" height="40" rx="20" fill="#3A4150"/>`;
  for (let h = 0; h <= 10; h++) s += `<circle cx="${x0 + h * U}" cy="${y}" r="12" fill="${h === pv ? '#1F2430' : '#F3EFE6'}" data-hole="${h}" style="cursor:pointer"/>`;
  s += `<g data-lever="1" style="cursor:grab"><circle cx="${x0 + 10 * U}" cy="${y}" r="24" fill="#C93C3C" stroke="#fff" stroke-width="3"/><circle cx="${x0 + 10 * U}" cy="${y}" r="44" fill="transparent"/></g></g>`;
  s += `<circle cx="${px}" cy="${y}" r="9" fill="#F2A33A" stroke="#1F2430" stroke-width="2" pointer-events="none"/>`;
  if (o.blinkHole != null) s += `<circle cx="${x0 + o.blinkHole * U}" cy="${y}" r="22" fill="none" stroke="#F2A33A" stroke-width="6" class="blink" pointer-events="none"/>`;
  // box on the left end
  if (!o.noBox) {
    const ex = px - pv * U * Math.cos(a), ey = y - pv * U * Math.sin(a);
    s += `<g transform="translate(${ex.toFixed(1)} ${(ey - 20 - boxH).toFixed(1)})" class="${p.shakeBox ? 'shake' : ''}" pointer-events="none">${crate(60, boxH, r.w === 3 ? '30' : '10')}</g>`;
  }
  if (a === 0 && !o.bare) s += `<path d="M${x0 + 10 * U},${y - 80} v40 M${x0 + 10 * U - 10},${y - 52} l10,12 l10,-12" fill="none" stroke="#C93C3C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>`;
  if (o.push) s += `<path d="M${x0 + 10 * U + 40},${y - 30} v60 M${x0 + 10 * U + 30},${y + 18} l10,12 l10,-12" fill="none" stroke="#C93C3C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (p.helpers) {
    const lab = (x, txt) => `<g transform="translate(${x} ${ground + 30})"><rect x="-70" y="-15" width="140" height="28" rx="9" fill="#1F2430"/><text y="5" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${esc(txt)}</text></g>`;
    s += lab((x0 + px) / 2, `${L.boxSide}: ${pv}`) + lab((px + x0 + 10 * U) / 2, `${L.handSide}: ${10 - pv}`);
  }
  return s;
}

// ---------- Crank and rod (lesson 11) ----------
const sliderX = (r, th) => SLD.cx + r * Math.cos(th) + Math.sqrt(SLD.rod * SLD.rod - (r * Math.sin(th)) ** 2);
function sliderSVG(p, o = {}) {
  const { cx, cy, R, rod } = SLD, th = p.theta || 0, L = t();
  const bell = o.bare ? null : LESSONS[10].rounds[p.round || 0].bell;
  let s = `<rect x="${cx + 60}" y="${cy + 26}" width="${560}" height="10" rx="5" fill="#CFC8BA"/>`;
  // wheel
  s += `<g transform="translate(${cx} ${cy}) rotate(${((th * 180) / Math.PI).toFixed(2)})"><circle r="${R}" fill="#F2A33A" stroke="#B86E0F" stroke-width="3"/>`;
  for (const [k, r] of Object.entries(SLD.pins)) s += `<circle cx="${r}" cy="0" r="10" fill="#FFF6EA" stroke="#B86E0F" stroke-width="2"/>`;
  s += `<circle r="16" fill="#FFF6EA"/>${axleCross(9)}</g>`;
  if (!o.bare) s += `<g transform="translate(${cx} ${cy})">${motorBadge(false)}</g>`;
  if (p.pinR && !o.noRod) {
    const pxp = cx + p.pinR * Math.cos(th), pyp = cy + p.pinR * Math.sin(th), sx = sliderX(p.pinR, th);
    s += `<line x1="${pxp.toFixed(1)}" y1="${pyp.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${cy}" stroke="#5B6270" stroke-width="18" stroke-linecap="round"/><line x1="${pxp.toFixed(1)}" y1="${pyp.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${cy}" stroke="#3A4150" stroke-width="12" stroke-linecap="round"/>`;
    s += `<rect x="${(sx - 20).toFixed(1)}" y="${cy - 22}" width="40" height="46" rx="6" fill="#3E7BEA" stroke="#1F55B5" stroke-width="3"/>`;
    if (o.hlRod) s += `<line x1="${pxp.toFixed(1)}" y1="${pyp.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${cy}" stroke="#F2A33A" stroke-width="30" stroke-linecap="round" opacity=".35" class="pulse"/>`;
  }
  if (p.pinR) {
    const pxp = cx + p.pinR * Math.cos(th), pyp = cy + p.pinR * Math.sin(th);
    s += `<circle cx="${pxp.toFixed(1)}" cy="${pyp.toFixed(1)}" r="11" fill="#C93C3C" stroke="#fff" stroke-width="3"/>`;
    if (o.hlPin) s += `<circle cx="${pxp.toFixed(1)}" cy="${pyp.toFixed(1)}" r="26" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  }
  if (o.spin) s += `<g transform="translate(${cx} ${cy})">${dirArrow(R + 18, true, '#C93C3C')}</g>`;
  if (bell != null) {
    const tip = p.bellDown ? 70 : p.ring ? Math.sin(p.ring * 40) * 12 : 0;
    s += `<g transform="translate(${bell + 26} ${cy + 26}) rotate(${tip.toFixed(1)} -26 0)"><rect x="-4" y="-80" width="8" height="80" fill="#5B6270"/><path d="M-26,-70 Q-26,-120 0,-122 Q26,-120 26,-70 L32,-60 L-32,-60Z" fill="#F2C94C" stroke="#B88A0C" stroke-width="3"/><circle cy="-54" r="7" fill="#B88A0C"/></g>`;
    s += `<text x="${bell + 26}" y="${cy + 64}" text-anchor="middle" font-size="15" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${esc(L.bell)}</text>`;
  }
  if (o.blink) s += `<circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="none" stroke="#F2A33A" stroke-width="6" class="blink"/>`;
  return s;
}

// ---------- Crane (lesson 12) ----------
const TOOLS = { tFast: { strength: 1 / 3, rate: 0.6, lock: false }, tStrong: { strength: 3, rate: 0.25, lock: false }, tWorm: { strength: 24, rate: 0.13, lock: true }, tRack: { strength: 1, rate: 0.35, lock: false } };
const CRN = { tx: 330, top: 210, ground: 432, boomL: 300, aMin: -10, aMax: 28, hookBox: [40, 250], armBox: [40, 340] };
function craneSVG(p, o = {}) {
  const L = t(), { tx, top, ground, boomL } = CRN;
  const aDeg = CRN.aMin + (CRN.aMax - CRN.aMin) * (p.val.boom || 0), a = (aDeg * Math.PI) / 180;
  const tipX = tx + boomL * Math.cos(a), tipY = top - boomL * Math.sin(a);
  const tipYTop = top - boomL * Math.sin((CRN.aMax * Math.PI) / 180);
  let s = `<rect x="0" y="${ground}" width="784" height="16" fill="#CFC8BA"/>`;
  // tower (lattice)
  s += `<rect x="${tx - 22}" y="${top}" width="44" height="${ground - top}" fill="none" stroke="#F2A33A" stroke-width="6"/>`;
  for (let y = top; y < ground - 10; y += 44) s += `<path d="M${tx - 22},${y} L${tx + 22},${y + 22} L${tx - 22},${y + 44}" fill="none" stroke="#F2A33A" stroke-width="4"/>`;
  // target arm line and flag
  if (!o.bare) {
    const t2 = (CRN.aMax - 1.5) * Math.PI / 180;
    s += `<line x1="${tx}" y1="${top}" x2="${(tx + (boomL + 30) * Math.cos(t2)).toFixed(1)}" y2="${(top - (boomL + 30) * Math.sin(t2)).toFixed(1)}" stroke="#1E8A4C" stroke-width="3" stroke-dasharray="8 6"/>`;
    const fy = tipYTop + 70;
    s += `<line x1="${tx + 160}" y1="${fy}" x2="${tx + boomL + 80}" y2="${fy}" stroke="#1E8A4C" stroke-width="3" stroke-dasharray="8 6"/><line x1="${tx + boomL + 80}" y1="${fy - 40}" x2="${tx + boomL + 80}" y2="${ground}" stroke="#1F2430" stroke-width="4"/><path d="M${tx + boomL + 82},${fy - 40} L${tx + boomL + 122},${fy - 28} L${tx + boomL + 82},${fy - 16}Z" fill="#1E8A4C"/>`;
  }
  // boom
  if (!o.noBoom) {
    s += `<g class="${p.shake.boom ? 'shake' : ''}"><g transform="rotate(${(-aDeg).toFixed(2)} ${tx} ${top})"><rect x="${tx - 10}" y="${top - 12}" width="${boomL + 20}" height="24" rx="6" fill="none" stroke="#F2A33A" stroke-width="5"/>`;
    for (let x = tx; x < tx + boomL; x += 30) s += `<path d="M${x},${top - 12} L${x + 15},${top + 12} L${x + 30},${top - 12}" fill="none" stroke="#F2A33A" stroke-width="3"/>`;
    s += `</g><circle cx="${tx}" cy="${top}" r="10" fill="#1F2430"/></g>`;
  }
  // rope and crate
  if (!o.noRope && !o.noBoom) {
    const rope = 300 - 240 * (p.val.hoist || 0);
    const crTop = Math.min(tipY + rope, ground - 50);
    s += `<g class="${p.shake.hoist ? 'shake' : ''}"><line x1="${tipX.toFixed(1)}" y1="${tipY.toFixed(1)}" x2="${tipX.toFixed(1)}" y2="${crTop.toFixed(1)}" stroke="#7A4D20" stroke-width="3"/><g transform="translate(${tipX.toFixed(1)} ${crTop.toFixed(1)})">${crate(60, 50)}</g></g>`;
  }
  if (o.hlTop) s += `<circle cx="${tx}" cy="${top}" r="34" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  if (o.upArrow) s += `<path d="M${tipX + 50},${tipY + 160} v-70 M${tipX + 40},${tipY + 100} l10,-12 l10,12" fill="none" stroke="#C93C3C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  // motor boxes with tool slots
  if (!o.bare) for (const [f, pos, label] of [['hoist', CRN.hookBox, L.hookMotor], ['boom', CRN.armBox, L.armMotor]]) {
    const [bx, by] = pos, tool = p.slots[f];
    s += `<g><rect x="${bx}" y="${by}" width="200" height="70" rx="12" fill="#5B6270"/><path d="M${bx + 26} ${by + 18}l-10 16h10l-5 14 16-19h-10l5-11z" fill="#F2A33A"/>
      <text x="${bx + 46}" y="${by + 22}" font-size="14" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${esc(label)}</text>
      <g data-mslot="${f}" style="cursor:pointer"><rect x="${bx + 46}" y="${by + 30}" width="140" height="32" rx="8" fill="${tool ? '#FFF6EA' : 'none'}" stroke="${tool ? '#F2A33A' : '#fff'}" stroke-width="2" stroke-dasharray="${tool ? '0' : '6 5'}"/>
      ${tool ? `<g transform="translate(${bx + 52} ${by + 33})">${icon(tool, 34, 26).replace('<svg', '<svg x="0" y="0"')}</g><text x="${bx + 92}" y="${by + 51}" font-size="13" font-weight="800" fill="#1F2430" font-family="Nunito, sans-serif">${esc(L[tool])}</text>` : ''}</g></g>`;
    if (o.blink && !tool) s += `<rect x="${bx - 6}" y="${by - 6}" width="212" height="82" rx="16" fill="none" stroke="#F2A33A" stroke-width="6" class="blink"/>`;
    if (o.ghost && !tool) s += `<text x="${bx + 116}" y="${by + 51}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Nunito, sans-serif" class="pulse">${esc(L.tWorm)}?</text>`;
    s += `<line x1="${bx + 200}" y1="${by + 35}" x2="${tx - 22}" y2="${f === 'hoist' ? top + 40 : top + 80}" stroke="#9AA3B2" stroke-width="3" stroke-dasharray="4 6"/>`;
  }
  return s;
}

// ---------- Top view (lesson 4) ----------
const LAYER = { gear: [32, 176, '#F2A33A', '#B86E0F'], beam: [46, 300, '#3A4150', '#1F2430'], bush: [40, 46, '#9AA3B2', '#5B6270'] };
function stackSVG(layers, len, o = {}) {
  // Front on the left; the axle goes in from the front; a wall stands right behind the parts.
  const x0 = 200, cy = 224, need = layers.length, wallX = x0 + need * U + 4, L = t();
  const txt = (x, y, str, anchor = 'middle', size = 16, cls = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif" class="${cls}">${esc(str)}</text>`;
  let s = `<rect x="${wallX}" y="40" width="30" height="368" rx="4" fill="#CFC8BA"/>`;
  for (let y = 48; y < 400; y += 18) s += `<line x1="${wallX + 2}" y1="${y + 12}" x2="${wallX + 28}" y2="${y}" stroke="#A89F8E" stroke-width="2"/>`;
  s += txt(wallX + 15, 30, L.wall) + txt(x0 - 26, cy + 6, L.front, 'end');
  layers.forEach((kind, i) => {
    const [w, h, fill, stroke] = LAYER[kind], cx = x0 + i * U + U / 2, falls = len != null && i >= len;
    const tr = falls ? `translate(${cx + 14} ${cy + 80}) rotate(18)` : `translate(${cx} ${cy})`;
    let shape = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${kind === 'beam' ? 10 : 6}" fill="${fill}" stroke="${falls ? '#C93C3C' : stroke}" stroke-width="${falls ? 4 : 2}"/>`;
    if (kind === 'gear') for (let y = -h / 2 + 8; y < h / 2 - 4; y += 10) shape += `<line x1="${-w / 2 + 4}" y1="${y}" x2="${w / 2 - 4}" y2="${y}" stroke="${stroke}" stroke-width="1.5" opacity=".6"/>`;
    s += `<g transform="${tr}" opacity="${falls ? 0.7 : 1}">${shape}</g>`;
    if (o.nums) s += txt(cx, cy - 162, String(i + 1), 'middle', 20, o.blink ? 'blink' : '');
  });
  if (o.ghost) s += `<rect x="${x0}" y="${cy - 9}" width="${need * U}" height="18" rx="3" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="7 6" opacity=".5" class="pulse"/>`;
  if (len != null) {
    s += `<rect x="${x0}" y="${cy - 8}" width="${len * U}" height="16" rx="3" fill="#1F2430"/>`;
    for (let i = 1; i < len; i++) s += `<rect x="${x0 + i * U - 1}" y="${cy - 8}" width="2" height="16" fill="#9AA3B2"/>`;
    s += txt(x0 + (len * U) / 2, cy + 186, `${L.axle} ${len}`, "middle", 20);
    if (len > need) s += `<g transform="translate(${wallX + 15} ${cy})"><circle r="16" fill="#C93C3C" stroke="#fff" stroke-width="3"/><text y="7" text-anchor="middle" font-size="20" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">!</text></g>`;
  }
  return s;
}

// ---------- Gear math (no physics engine needed) ----------
function analyze(p) {
  const gs = p.gears.map((g) => { const a = p.axles.find((x) => x.id === g.axle); return { ...g, x: holeX(a.hx), y: holeY(a.hy), r: g.worm ? U / 2 : radius(g.teeth) }; });
  const adj = {}; gs.forEach((g) => (adj[g.id] = []));
  const pairs = [];
  for (let i = 0; i < gs.length; i++) for (let j = i + 1; j < gs.length; j++) {
    const a = gs[i], b = gs[j], d = Math.hypot(b.x - a.x, b.y - a.y), s = a.r + b.r;
    if (a.hidden || b.hidden) continue;
    if (a.worm || b.worm) {
      // A worm stands upright next to a gear: same height, (gear radius + half a hole) away.
      if (a.worm && b.worm) { if (d < U) { adj[a.id].push([b, 'jam']); adj[b.id].push([a, 'jam']); pairs.push({ type: 'jam', x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }); } continue; }
      const w = a.worm ? a : b, g = a.worm ? b : a, dx = g.x - w.x, dy = g.y - w.y;
      if (Math.abs(dy) < 1 && Math.abs(Math.abs(dx) - (g.r + U / 2)) < 1.5) {
        adj[w.id].push([g, 'worm']); adj[g.id].push([w, 'wormback']);
        pairs.push({ type: 'mesh', x: w.x + Math.sign(dx) * (U / 2), y: w.y });
      } else if (Math.abs(dy) < g.r + 38 && Math.abs(dx) < g.r + U / 2 - 1.5) {
        adj[a.id].push([b, 'jam']); adj[b.id].push([a, 'jam']);
        pairs.push({ type: 'jam', x: w.x + Math.sign(dx) * (U / 2), y: (w.y + g.y) / 2 });
      }
      continue;
    }
    if (Math.abs(d - s) < 1.5) {
      adj[a.id].push([b, 'mesh']); adj[b.id].push([a, 'mesh']);
      pairs.push({ type: 'mesh', x: a.x + ((b.x - a.x) * a.r) / d, y: a.y + ((b.y - a.y) * a.r) / d });
    } else if (d < s - 1.5) {
      adj[a.id].push([b, 'jam']); adj[b.id].push([a, 'jam']);
      const f = d > 0 ? (a.r - (s - d) / 2) / d : 0;
      pairs.push({ type: 'jam', x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
    }
  }
  const motorGear = p.motor ? gs.find((g) => g.axle === p.motor) || null : null;
  const order = motorGear ? [motorGear, ...gs.filter((g) => g !== motorGear)] : gs;
  const info = {};
  for (const root of order) {
    if (info[root.id]) continue;
    info[root.id] = { root: root.id, k: 1, c: 0 };
    const comp = [root], q = [root];
    let jam = false, locked = false;
    while (q.length) {
      const u = q.shift(), iu = info[u.id];
      if (u.worm) locked = true;
      for (const [v, type] of adj[u.id]) {
        if (type === 'jam') jam = true;
        const th = Math.atan2(v.y - u.y, v.x - u.x), ratio = u.teeth / v.teeth;
        let k2 = -ratio * iu.k, c2 = meshAngle(iu.c, u.teeth, v.teeth, th);
        if (type === 'worm') { k2 = (v.x > u.x ? -1 : 1) * iu.k / v.teeth; c2 = 0; }
        if (type === 'wormback') { k2 = (u.x > v.x ? -1 : 1) * iu.k * u.teeth; c2 = 0; }
        if (info[v.id]) { if (type !== 'jam' && Math.abs(info[v.id].k - k2) > 1e-6) jam = true; continue; }
        info[v.id] = { root: root.id, k: k2, c: c2 }; comp.push(v); q.push(v);
      }
    }
    comp.forEach((g) => { info[g.id].jam = jam; info[g.id].locked = locked; });
  }
  const phis = {};
  for (const g of gs) if (info[g.id].root === g.id) phis[g.id] = p.ang[g.id] || 0;
  p.phis = phis;
  // Lesson 2: is the motor strong enough for the box?
  const L = LESSONS[S.li];
  let loadGear = L.load ? gs.find((g) => g.axle === L.load) || null : null;
  // Lesson 8: the gear whose teeth touch the rack.
  if (L.rack) loadGear = gs.find((g) => !g.hidden && !g.worm && Math.abs(g.x + g.r - L.rack.x) < 1.5 && g.y >= holeY(4) - 1 && g.y <= holeY(5) + 1) || null;
  const stall = !!(L.load && loadGear && motorGear && info[loadGear.id].root === motorGear.id && 1 / Math.abs(info[loadGear.id].k) < (L.strength || STRENGTH_NEEDED));
  return { gs, info, pairs, motorGear, loadGear, stall };
}
const gearAngle = (an, p, g) => { const i = an.info[g.id]; return i.k * (p.phis[i.root] || 0) + i.c; };

function nextGhost(p) {
  if (LS().guided === false || LS().type) return null;
  for (const gh of LS().ghosts) {
    const ax = p.axles.find((a) => a.hx === gh.hx && a.hy === gh.hy);
    if (gh.type === 'axle' && !ax) return gh;
    if (gh.type === 'gear' && !(ax && p.gears.some((g) => g.axle === ax.id && g.teeth === gh.teeth))) return gh;
    if (gh.type === 'motor' && !(ax && p.motor === ax.id)) return gh;
  }
  return null;
}
function used(p) {
  return { axle: p.axles.filter((a) => !a.fixed && !a.worm).length, g8: p.gears.filter((g) => g.teeth === 8).length, g16: p.gears.filter((g) => g.teeth === 16).length, g24: p.gears.filter((g) => g.teeth === 24).length, motor: p.motor && !p.motorFixed ? 1 : 0, crankS: p.crank && p.crank.kind === 'crankS' ? 1 : 0, crankL: p.crank && p.crank.kind === 'crankL' ? 1 : 0, worm: p.gears.filter((g) => g.worm).length };
}

// ---------- Speech ----------
let speaking = false;
function setSpeaking(on) {
  speaking = on;
  document.querySelectorAll('.speak').forEach((b) => { b.innerHTML = speakIcon(); b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? t().stopAudio : t().listen); });
}
function stopSpeech() {
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  speaking = false;
}
function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    if (speaking) { stopSpeech(); setSpeaking(false); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\n/g, ' ').replace(/\u2605/g, ''));
    u.lang = S.lang === 'de' ? 'de-DE' : 'en-GB'; u.rate = 0.9;
    u.onend = u.onerror = () => { if (speaking) setSpeaking(false); };
    speechSynthesis.speak(u);
    setSpeaking(true);
  } catch (e) { setSpeaking(false); }
}
const playIcon = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="#1F2430"/></svg>`;
const stopIcon = `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5" fill="#1F2430"/></svg>`;
const speakIcon = () => (speaking ? stopIcon : playIcon);
const speakBtn = () => `<button class="speak" data-act="speak" aria-pressed="${speaking}" aria-label="${esc(speaking ? t().stopAudio : t().listen)}">${speakIcon()}</button>`;
const homeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7M6 9.5V20h4.5v-5.5h3V20H18V9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const speakerIcon = `<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="#1F2430"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#1F2430" stroke-width="2" stroke-linecap="round"/></svg>`;
const logo = `<svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><rect x="2" y="10" width="32" height="22" rx="5" fill="#F2A33A"/><rect x="7" y="4" width="8" height="8" rx="3" fill="#F2A33A"/><rect x="21" y="4" width="8" height="8" rx="3" fill="#F2A33A"/><circle cx="12" cy="21" r="4" fill="#fff"/><circle cx="24" cy="21" r="4" fill="#fff"/></svg>`;
const checkIcon = (c = '#1E6E40') => `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9.5l4 4 8-9" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const lockIcon = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const bulb = `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const flipIcon = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18.5 2.5v4.5H14M5.5 21.5V17H10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const eyeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Screens ----------
const app = document.getElementById('app');

function header(inLesson) {
  const L = t();
  const langSw = `<div class="lang" role="group" aria-label="Language / Sprache"><button data-act="lang" data-v="en" aria-pressed="${S.lang === 'en'}">EN</button><button data-act="lang" data-v="de" aria-pressed="${S.lang === 'de'}">DE</button></div>`;
  if (!inLesson) return `<header class="top"><button class="logo" data-act="map" aria-label="BrickL">${logo}<span>BrickL</span></button><span style="color:var(--muted)">${esc(L.tagline)}</span><span class="spacer"></span>${langSw}</header>`;
  const steps = L.steps.map((s, i) => `<button class="step ${i === S.step ? 'on' : i < S.step ? 'done' : ''}" data-act="step" data-v="${i}" ${i === S.step ? 'aria-current="step"' : ''}>${i < S.step ? checkIcon() : i + 1 + ' '}${esc(s)}</button>`).join('');
  return `<header class="top"><button class="btn home" data-act="map" aria-label="${esc(L.home)}" title="${esc(L.home)}">${homeIcon}</button><button class="logo" data-act="map" aria-label="${esc(L.home)}">${logo}<span>BrickL</span></button>
    <div class="lesson-name"><small>${esc(L.lesson)} ${S.li + 1}</small><b>${esc(L.lessons[S.li])}</b></div>
    <nav class="steps" aria-label="Steps">${steps}</nav>${langSw}
    ${S.step === 1 ? `<button class="btn" data-act="hint">${bulb}${esc(L.hint)}</button>` : ''}</header>`;
}

function renderMap() {
  const L = t();
  let n = 0;
  const tiers = MAP.map((ids, ti) => `<section class="tier"><h2>${ti + 1}. ${esc(L.tiers[ti])} <small>${esc(L.tierSub[ti])}</small></h2><div class="cards">${ids.map((id) => {
    n++;
    const open = id < LESSONS.length, done = S.done.includes('l' + (id + 1));
    const cls = done ? 'done' : open ? 'open' : 'locked';
    const tag = done ? checkIcon() + esc(L.doneTag) : open ? esc(L.start) + ' →' : lockIcon + esc(L.soon);
    return `<button class="lcard ${cls}" ${open ? `data-act="open" data-v="${id}"` : 'aria-disabled="true"'}><span class="num">${esc(L.lesson)} ${n}</span><b>${esc(L.lessons[id])}</b><span class="tag">${tag}</span></button>`;
  }).join('')}</div></section>`).join('');
  app.innerHTML = header(false) + `<main class="map"><h1>${esc(L.path)}</h1>${tiers}</main><footer class="foot">${esc(L.disclaimer)}</footer>`;
}

// Idea pictures
function ideaPic() {
  const k = LS().idea, lbl = (y, s) => `<text y="${y}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="22" font-weight="800" fill="#1F2430">${s}</text>`;
  if (k.kind === 'pair') {
    const ra = radius(k.a), rb = radius(k.b);
    return `<g transform="translate(170 150)"><g id="ig1">${gearSVG(k.a)}</g>${lbl(ra + 34, k.labels[0])}</g>
      <g transform="translate(${170 + ra + rb} 150)"><g id="ig2">${gearSVG(k.b)}</g>${lbl(rb + 34, k.labels[1])}</g>`;
  }
  if (k.kind === 'lift') {
    const r8 = radius(8), r24 = radius(24);
    return `<g transform="translate(110 110)"><g id="ig1">${gearSVG(8)}</g>${lbl(r8 + 30, '3×')}</g>
      <g transform="translate(${110 + r8 + r24} 110)"><g id="ig2">${gearSVG(24)}</g></g>
      <line id="irope" x1="${110 + r8 + r24 + 18}" y1="110" x2="${110 + r8 + r24 + 18}" y2="220" stroke="#7A4D20" stroke-width="3"/>
      <g id="ibox" transform="translate(${110 + r8 + r24 + 18} 220)">${crate(56, 50)}</g>
      <text x="300" y="${110 + r24 + 30}" text-anchor="end" font-family="Baloo 2, sans-serif" font-size="22" font-weight="800" fill="#1F2430"></text>`;
  }
  if (k.kind === 'lever' || k.kind === 'slider' || k.kind === 'crane') return `<g transform="${k.kind === 'crane' ? 'translate(10 0) scale(.62)' : 'translate(-30 20) scale(.62)'}" id="ipic"></g>`;
  if (k.kind === 'worm') return `<g transform="translate(150 150)"><g id="iworm">${wormBody(0, 'iwc')}</g></g><g transform="translate(${150 + U / 2 + radius(24)} 150)"><g id="ig2">${gearSVG(24)}</g></g>${lbl(0, '')}
      <text x="150" y="240" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="20" font-weight="800" fill="#1F2430">1 \u21bb</text><text x="${150 + U / 2 + radius(24)}" y="270" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="20" font-weight="800" fill="#1F2430">1/24 \u21bb</text>`;
  if (k.kind === 'rack') return `<g transform="translate(180 150)"><g id="ig1">${gearSVG(24)}</g></g><g id="irack">${rackSVG(180 + radius(24), 40, 260)}</g>`;
  if (k.kind === 'corner') return `<g transform="translate(-30 -10) scale(.62)">${cornerSVG('b12', 'b12', {})}</g>`;
  if (k.kind === 'stack') return `<g transform="translate(40 12) scale(.62)">${stackSVG(['gear', 'beam', 'bush'], 3, { nums: true })}</g>`;
  if (k.kind === 'chain') {
    const xs = [100, 100 + radius(24) + radius(16), 100 + radius(24) + 2 * radius(16) + radius(8)];
    return [24, 16, 8].map((tt, i) => `<g transform="translate(${xs[i]} 140)"><g id="ig${i + 1}">${gearSVG(tt)}</g>${lbl(radius(tt) + 36, ['1\u00d7', '1.5\u00d7', '3\u00d7'][i])}</g>`).join('');
  }
  if (k.kind === 'crank') {
    return `<g transform="translate(170 90)"><circle r="26" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/><g id="ig1">${crankArm(110)}</g></g>
      <line id="irope" x1="196" y1="90" x2="196" y2="220" stroke="#7A4D20" stroke-width="3"/><g id="ibox" transform="translate(196 220)">${crate(56, 50)}</g>`;
  }
  // three gears in a row
  const r = radius(16);
  return [0, 1, 2].map((i) => `<g transform="translate(${118 + i * 2 * r} 160)"><g id="ig${i + 1}">${gearSVG(16)}</g>${dirArrow(r + 14, i !== 1, GEAR_COL[16][1])}${lbl(r + 36, String(i + 1))}</g>`).join('');
}
function renderIdea() {
  const L = t(), TL = tl();
  app.innerHTML = header(true) + `<main class="idea">
    <svg class="pic" viewBox="0 0 460 300" role="img" aria-label="${esc(TL.idea)}">${ideaPic()}</svg>
    <div class="say"><div class="row">${speakBtn()}</div>
      <p>${esc(TL.idea)}</p><p class="sub">${esc(TL.ideaSub)}</p>
      <div class="row"><button class="btn big" data-act="step" data-v="1">${esc(L.next)} →</button></div></div>
  </main>`;
}
let ideaA = 0;
function tickIdea(dt) {
  const k = LS().idea, set = (id, a) => { const el = document.getElementById(id); if (el) el.setAttribute('transform', `rotate(${((a * 180) / Math.PI).toFixed(2)})`); };
  ideaA += dt * 0.9;
  if (k.kind === 'pair') { set('ig1', ideaA); set('ig2', meshAngle(ideaA, k.a, k.b, 0)); }
  else if (k.kind === 'lift') {
    const a1 = ideaA * 2.2; set('ig1', a1); set('ig2', meshAngle(a1, 8, 24, 0));
    const cycle = (ideaA * 2.2) % 9, lift = cycle < 7 ? cycle * 12 : 84 - (cycle - 7) * 42;
    const box = document.getElementById('ibox'), rope = document.getElementById('irope');
    if (box) { const x = 110 + radius(8) + radius(24) + 18; box.setAttribute('transform', `translate(${x} ${220 - lift})`); rope.setAttribute('y2', 220 - lift); }
  } else if (k.kind === 'lever' || k.kind === 'slider' || k.kind === 'crane') {
    const g = document.getElementById('ipic');
    if (g) {
      const w = (Math.sin(ideaA * 1.5) + 1) / 2;
      if (k.kind === 'lever') g.innerHTML = leverSVG({ pivot: 3, levA: w * LEV.maxA, round: 0, helpers: false }, { bare: true });
      if (k.kind === 'slider') g.innerHTML = sliderSVG({ pinR: SLD.pins.pinEdge, theta: ideaA * 2, round: 0 }, { bare: true });
      if (k.kind === 'crane') g.innerHTML = craneSVG({ slots: {}, val: { hoist: w, boom: (Math.sin(ideaA * 0.7) + 1) / 2 }, shake: {} }, { bare: true });
    }
  } else if (k.kind === 'worm') {
    const wa = ideaA * 6, w = document.querySelector('#iworm .wthreads');
    if (w) w.setAttribute('transform', `translate(0 ${((((wa / TAU) * 14) % 14) + 14) % 14})`);
    set('ig2', wa / 24);
  } else if (k.kind === 'rack') {
    const a = ideaA * 1.2, y = Math.sin(a) * 60; set('ig1', -Math.cos(a) * 60 / radius(24));
    const r = document.getElementById('irack'); if (r) r.setAttribute('transform', `translate(0 ${y.toFixed(1)})`);
  } else if (k.kind === 'corner') {
    tickCorner(dt, 'b12', 'b12');
  } else if (k.kind === 'chain') {
    const a2 = meshAngle(ideaA, 24, 16, 0); set('ig1', ideaA); set('ig2', a2); set('ig3', meshAngle(a2, 16, 8, 0));
  } else if (k.kind === 'crank') {
    set('ig1', -ideaA * 1.6);
    const cycle = (ideaA * 1.6) % 9, lift = cycle < 7 ? cycle * 12 : 84 - (cycle - 7) * 42;
    const box = document.getElementById('ibox'), rope = document.getElementById('irope');
    if (box) { box.setAttribute('transform', `translate(196 ${220 - lift})`); rope.setAttribute('y2', 220 - lift); }
  } else if (k.kind === 'three') {
    set('ig1', ideaA); set('ig2', meshAngle(ideaA, 16, 16, 0)); set('ig3', meshAngle(meshAngle(ideaA, 16, 16, 0), 16, 16, 0));
  }
}

function renderPlay() {
  const L = t(), TL = tl(), p = S.play, u = used(p), st = LS().stock;
  const ng = nextGhost(p);
  const nextKey = ng ? (ng.type === 'gear' ? 'g' + ng.teeth : ng.type) : null;
  const LL = LS(), stack = !!LL.rounds;
  const items = [['axle', L.axle, ''], ['g24', L.gear + ' 24', L.big], ['g16', L.gear + ' 16', L.medium], ['g8', L.gear + ' 8', L.small], ['motor', L.motor, ''],
    ['crankS', L.crankS, L.oneHole], ['crankL', L.crankL, L.twoHoles], ...[2, 3, 4, 5, 6].map((n) => ['ax' + n, L.axle + ' ' + n, '']),
    ['worm', L.worm, ''], ['b12', L.b12, L.slanted], ['b20', L.b20, L.slanted], ['pivot', L.pivot, ''],
    ['pinNear', L.pinNear, ''], ['pinMid', L.pinMid, ''], ['pinEdge', L.pinEdge, ''], ['tFast', L.tFast, ''], ['tStrong', L.tStrong, ''], ['tWorm', L.tWorm, ''], ['tRack', L.tRack, '']]
    .filter(([k]) => st[k] > 0)
    .map(([k, name, sub]) => (LL.type === 'corner' && k === 'g24' ? [k, L.flat24, L.flatW] : [k, name, sub]))
    .map(([k, name, sub]) => {
      const left = LL.reusable ? st[k] : st[k] - (u[k] || 0);
      return `<button class="titem ${left <= 0 ? 'empty' : ''} ${k === nextKey && left > 0 ? 'next' : ''}" data-part="${k}" aria-label="${esc(name)}, ${left} ${esc(L.left)}">${icon(k)}<span><b>${esc(name)}</b><small>${sub ? esc(sub) + ' · ' : ''}×${left}</small></span></button>`;
    }).join('');
  app.innerHTML = header(true) + `<main class="play">
    <aside class="tray" aria-label="${esc(L.parts)}"><h3>${esc(L.parts)}</h3><p class="tip">${esc(L.dragTip)}</p>${items}</aside>
    <div class="boardwrap">
      <div class="goal"><small>${esc(L.goal)}</small><span>${stack ? `${esc(L.task)} ${p.round + 1}/${LL.rounds.length}: ` : ''}${esc(TL.goals ? TL.goals[p.round] : TL.goal)}</span></div>
      <section class="board" id="board" aria-label="Board"><svg id="bsvg" viewBox="0 0 ${BW} ${BH}" preserveAspectRatio="xMidYMid meet"></svg>
        ${S.toast ? `<div class="toast" role="status">${esc(S.toast)}</div>` : ''}
      </section>
      <div class="controls">
        ${LL.noMotor ? '' : `<button class="toggle" data-act="motor" aria-pressed="${p.motorOn}"><span class="track"></span>${esc(L.motorBtn)}</button>
        ${LL.type === 'slider' ? '' : `<button class="chip" data-act="flip">${flipIcon}${esc(L.flip)}</button>`}`}
        ${LL.holds ? LL.holds.map((f) => [1, -1].map((d) => `<button class="chip hold" data-hold="${f}:${d}">${d > 0 ? '\u25b2' : '\u25bc'} ${esc(f === 'hoist' ? L.hook : L.arm)}</button>`).join('')).join('') : ''}
        <button class="chip" data-act="helpers" aria-pressed="${p.helpers}">${eyeIcon}${esc(L.helpers)}</button>
        <span class="spacer"></span>
        <button class="btn big" data-act="test">${esc(L.test)}</button>
      </div>
    </div></main>` + panelHTML();
  S.an = analyze(p);
  drawBoard();
}

function fmtSpeed(k) {
  const a = Math.abs(k);
  if (a >= 1 - 1e-6) return (Math.round(a * 10) / 10) + '×';
  return '1/' + Math.round(1 / a) + '×';
}

const LOAD_DRUM = 18, BOX_FLOOR = BH - 8, BOX_H = 60;
const RACK_TOP = 250;
function rackSVG(x, top, len) {
  // Teeth face left; x is the line where the gear teeth touch.
  let s = `<rect x="${x + 2}" y="${top}" width="22" height="${len}" rx="3" fill="#C7CDD6" stroke="#5B6270" stroke-width="2"/>`;
  for (let y = top + 6; y < top + len - 10; y += 22) s += `<path d="M${x + 3},${y} L${x - 7},${y + 5} L${x - 7},${y + 11} L${x + 3},${y + 16}Z" fill="#C7CDD6" stroke="#5B6270" stroke-width="1.5"/>`;
  return s;
}
function boxTop(p) { return BOX_FLOOR - BOX_H - p.lift; }

function drawBoard() {
  const svg = document.getElementById('bsvg');
  if (!svg) return;
  const p = S.play, an = S.an, LL = LS();
  if (LL.draw) {
    const pr = S.hintLevel >= 2 && !S.win ? LL.check(p, S.an || {}) : null;
    let blinkHole = null;
    if (LL.type === 'lever' && pr && pr !== 'push') blinkHole = p.round === 0 ? 2 : 5;
    svg.innerHTML = LL.draw({ ...p, helpers: p.helpers }, { blink: !!pr, blinkHole, ghost: S.hintLevel >= 3 && !S.win });
    return;
  }
  if (LL.type === 'corner') {
    svg.innerHTML = cornerSVG(p.slotA, p.slotB, { labels: p.helpers, blink: S.hintLevel >= 2 && !S.win });
    return;
  }
  if (LL.type === 'stack') {
    svg.innerHTML = stackSVG(LL.rounds[p.round], p.axleLen, { nums: p.helpers || S.hintLevel >= 2, blink: S.hintLevel >= 2 && !S.win, ghost: S.hintLevel >= 3 && !S.win });
    return;
  }
  let out = '';
  for (let r = 0; r < ROWS; r++) {
    out += `<rect x="${OX - 26}" y="${holeY(r) - 20}" width="${(COLS - 1) * U + 52}" height="40" rx="20" fill="#3A4150"/>`;
    for (let c = 0; c < COLS; c++) out += `<circle cx="${holeX(c)}" cy="${holeY(r)}" r="12" fill="#F3EFE6"/>`;
  }
  // Lesson 2: flag and drum
  const loadAx = LL.load ? p.axles.find((a) => a.id === LL.load) : null;
  if (loadAx) {
    const lx = holeX(loadAx.hx) + (LL.drum || LOAD_DRUM), flagY = BOX_FLOOR - BOX_H - MAX_LIFT;
    out += `<g pointer-events="none"><line x1="${lx + 56}" y1="${flagY - 40}" x2="${lx + 56}" y2="${BOX_FLOOR}" stroke="#1F2430" stroke-width="4"/><path d="M${lx + 58},${flagY - 40} L${lx + 98},${flagY - 28} L${lx + 58},${flagY - 16}Z" fill="#1E8A4C"/>
      <line x1="${lx - 40}" y1="${flagY}" x2="${lx + 56}" y2="${flagY}" stroke="#1E8A4C" stroke-width="3" stroke-dasharray="8 6"/></g>`;
    out += `<g transform="translate(${holeX(loadAx.hx)} ${holeY(loadAx.hy)})" pointer-events="none"><circle r="${LOAD_DRUM + 6}" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/><circle r="${LOAD_DRUM - 2}" fill="none" stroke="#7A4D20" stroke-width="3"/></g>`;
  }
  // Lesson 8: rack, platform and flag
  if (LL.rack) {
    const x = LL.rack.x, flagY = RACK_TOP - 12 - MAX_LIFT;
    out += `<g pointer-events="none"><rect x="${x + 26}" y="${holeY(2) - 10}" width="14" height="20" rx="3" fill="#5B6270"/><rect x="${x + 26}" y="${holeY(6) - 10}" width="14" height="20" rx="3" fill="#5B6270"/>
      <line x1="${x + 110}" y1="${flagY - 40}" x2="${x + 110}" y2="${BH}" stroke="#1F2430" stroke-width="4"/><path d="M${x + 112},${flagY - 40} L${x + 152},${flagY - 28} L${x + 112},${flagY - 16}Z" fill="#1E8A4C"/>
      <line x1="${x - 40}" y1="${flagY}" x2="${x + 110}" y2="${flagY}" stroke="#1E8A4C" stroke-width="3" stroke-dasharray="8 6"/></g>`;
    out += `<g id="rack" transform="translate(0 ${-p.lift})" pointer-events="none">${rackSVG(x, RACK_TOP, 320)}<rect x="${x - 34}" y="${RACK_TOP - 12}" width="92" height="12" rx="4" fill="#5B6270"/><g transform="translate(${x + 12} ${RACK_TOP - 12 - 44})">${crate(56, 44)}</g></g>`;
  }
  // Ghosts
  const gl = S.hintLevel >= 3 ? LL.ghosts : [nextGhost(p)].filter(Boolean);
  for (const gh of gl) {
    const x = holeX(gh.hx), y = holeY(gh.hy);
    if (gh.type === 'axle') out += `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#F2A33A" stroke-width="4" stroke-dasharray="6 5" class="pulse"/>`;
    if (gh.type === 'gear') out += `<g transform="translate(${x} ${y})" class="pulse">${gearSVG(gh.teeth, { ghost: true })}</g>`;
    if (gh.type === 'worm') out += `<g transform="translate(${x} ${y})" class="pulse"><rect x="-19" y="-36" width="38" height="72" rx="8" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="7 6" opacity=".5"/></g>`;
    if (gh.type === 'crank') out += `<g transform="translate(${x} ${y})" class="pulse"><rect x="-13" y="-13" width="${gh.len * U + 26}" height="26" rx="13" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="7 6" opacity=".5"/></g>`;
    if (gh.type === 'motor') out += `<g transform="translate(${x} ${y})" class="pulse" opacity=".5"><rect x="-26" y="14" width="52" height="24" rx="8" fill="none" stroke="#1F2430" stroke-width="3" stroke-dasharray="6 5"/></g>`;
  }
  // Bare axles
  for (const a of p.axles) if (!p.gears.some((g) => g.axle === a.id)) out += `<g transform="translate(${holeX(a.hx)} ${holeY(a.hy)})" data-aid="${a.id}" style="cursor:pointer"><circle r="22" fill="transparent"/>${axleEnd()}</g>`;
  // Gears
  for (const g of an.gs) {
    if (g.hidden) continue;
    if (g.worm) { out += `<g transform="translate(${g.x} ${g.y})" data-gid="${g.id}" style="cursor:grab"><g id="rot-${g.id}" data-worm="1">${wormBody(gearAngle(an, p, g), 'wc-' + g.id)}</g></g>`; continue; }
    const deg = (gearAngle(an, p, g) * 180) / Math.PI;
    out += `<g transform="translate(${g.x} ${g.y})" data-gid="${g.id}" style="cursor:grab"><g id="rot-${g.id}" transform="rotate(${deg.toFixed(2)})">${gearSVG(g.teeth)}</g></g>`;
  }
  // Rope + box (on top of gears)
  if (loadAx) {
    const lx = holeX(loadAx.hx) + (LL.drum || LOAD_DRUM), ly = holeY(loadAx.hy);
    out += `<line id="rope" x1="${lx}" y1="${ly}" x2="${lx}" y2="${boxTop(p)}" stroke="#7A4D20" stroke-width="3.5" pointer-events="none"/>`;
    out += `<g id="box" transform="translate(${lx} ${boxTop(p)})" pointer-events="none">${crate()}</g>`;
  }
  // Crank
  if (p.crank) {
    const a = p.axles.find((x) => x.id === p.crank.axle), g = an.gs.find((x) => x.axle === a.id);
    const deg = g ? (gearAngle(an, p, g) * 180) / Math.PI : 0, Lp = p.crank.len * U;
    out += `<g transform="translate(${holeX(a.hx)} ${holeY(a.hy)})" data-cid="1" style="cursor:grab"><g id="crank" transform="rotate(${deg.toFixed(2)})">${crankArm(Lp)}<rect x="-20" y="-28" width="${Lp + 50}" height="56" fill="transparent"/></g></g>`;
  }
  // Badges: star, motor
  for (const a of p.axles) if (a.star) out += `<g transform="translate(${holeX(a.hx)} ${holeY(a.hy)})" pointer-events="none">${starBadge()}</g>`;
  if (p.motor) { const a = p.axles.find((x) => x.id === p.motor); out += `<g transform="translate(${holeX(a.hx)} ${holeY(a.hy)})" data-mid="1" style="cursor:pointer">${motorBadge(p.motorOn && an.stall)}</g>`; }
  // Mesh / jam marks
  for (const pr of an.pairs) out += pr.type === 'mesh'
    ? `<circle cx="${pr.x}" cy="${pr.y}" r="7" fill="#1E8A4C" stroke="#fff" stroke-width="2.5" pointer-events="none"/>`
    : `<g transform="translate(${pr.x} ${pr.y})" pointer-events="none"><circle r="13" fill="#C93C3C" stroke="#fff" stroke-width="2.5"/><text y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">!</text></g>`;
  // Helpers: speed and direction
  if (p.helpers) for (const g of an.gs) {
    if (g.hidden) continue;
    const inf = an.info[g.id];
    const driven = an.motorGear && inf.root === an.motorGear.id && !inf.jam;
    const name = g.worm ? t().worm : g.teeth;
    const label = driven ? `${name} \u00b7 ${fmtSpeed(inf.k)}` : `${name}`;
    const w = label.length * 9 + 18;
    out += `<g transform="translate(${g.x} ${g.y + g.r + 22})" pointer-events="none"><rect x="${-w / 2}" y="-14" width="${w}" height="28" rx="9" fill="#1F2430"/><text y="6" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${label}</text></g>`;
    if (driven && p.motorOn && !an.stall && !g.worm) out += `<g transform="translate(${g.x} ${g.y})" pointer-events="none">${dirArrow(g.r + 14, inf.k * (p.reverse ? -1 : 1) * (LL.motorDir || 1) > 0, GEAR_COL[g.teeth][1])}</g>`;
  }
  // Hint: point
  if (S.hintLevel >= 2 && !S.win) {
    const pr = LL.check(p, an), tg = pr && LL.target(pr, an);
    if (tg) out += `<circle cx="${tg[0]}" cy="${tg[1]}" r="44" fill="none" stroke="#F2A33A" stroke-width="7" class="blink" pointer-events="none"/>`;
  }
  // Selection: remove button
  if (p.sel) {
    const pos = selPos(p.sel);
    if (pos) out += `<g transform="translate(${pos[0]} ${pos[1]})" data-del="1" style="cursor:pointer" role="button" aria-label="Remove"><circle r="22" fill="#C93C3C" stroke="#fff" stroke-width="3"/><path d="M-7,-7 L7,7 M7,-7 L-7,7" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>`;
  }
  svg.innerHTML = out;
}
function selPos(sel) {
  const p = S.play;
  if (sel.kind === 'gear') { const g = S.an.gs.find((x) => x.id === sel.id); return g ? [g.x + g.r * 0.72, g.y - g.r * 0.72] : null; }
  if (sel.kind === 'axle') { const a = p.axles.find((x) => x.id === sel.id); return a ? [holeX(a.hx) + 26, holeY(a.hy) - 26] : null; }
  if (sel.kind === 'crank' && p.crank) { const a = p.axles.find((x) => x.id === p.crank.axle); return [holeX(a.hx) - 30, holeY(a.hy) - 34]; }
  if (sel.kind === 'motor' && p.motor) { const a = p.axles.find((x) => x.id === p.motor); return [holeX(a.hx) + 40, holeY(a.hy) + 26]; }
  return null;
}

function panelHTML() {
  const L = t(), TL = tl();
  if (S.win) return `<div class="overlay"><div class="panel" role="dialog" aria-modal="true"><h2>${esc(L.win)}</h2><p>${esc(TL.winSub)}</p><button class="btn big" data-act="step" data-v="2">${esc(L.toBuild)} →</button></div></div>`;
  if (S.panel === 'round') return `<div class="overlay"><div class="panel" role="dialog" aria-modal="true"><h2>${esc(L.fits)}</h2><button class="btn big" data-act="nextRound">${esc(L.nextTask)} \u2192</button></div></div>`;
  if (!S.panel) return '';
  const p = S.play, prob = LS().check(p, S.an || analyze(p));
  let body = '';
  if (S.panel === 'fail') {
    body = `<h2>${esc(S.fails >= 2 ? L.fail2 : L.fail1)}</h2><div class="row" style="justify-content:center">` +
      (S.fails >= 2 ? `<button class="btn dark" data-act="hint">${bulb}${esc(L.getHint)}</button>` : '') + `<button class="btn" data-act="close">${esc(L.ok)}</button></div>`;
  } else if (S.panel === 'hint') {
    const lines = [prob ? TL.prob[prob] : L.looksRight];
    if (prob && S.hintLevel === 2) lines.push(L.pointText);
    if (prob && S.hintLevel >= 3) lines.push(L.showText);
    body = `<div class="hintbox">${lines.map((x) => `<p>${esc(x)}</p>`).join('')}</div><div class="row" style="justify-content:center">` +
      (S.hintLevel < 3 && prob ? `<button class="btn dark" data-act="hint">${bulb}${esc(L.moreHint)}</button>` : '') + `<button class="btn" data-act="close">${esc(L.ok)}</button></div>`;
  }
  return `<div class="overlay"><div class="panel" role="dialog" aria-modal="true">${body}</div></div>`;
}

// ---------- Build step ----------
function buildScene(cfg, label) {
  // Side view of a 9-hole beam.
  const bx = 110, by = 128, hx = (n) => bx + n * U;
  let s = `<svg class="scene" viewBox="0 0 760 270" role="img" aria-label="${esc(label)}">`;
  if (cfg.svg) return s.replace('viewBox="0 0 760 270"', 'viewBox="0 0 784 470"') + cfg.svg() + '</svg>';
  if (cfg.corner) return s + `<g transform="translate(150 -12) scale(.62)">${cornerSVG(cfg.corner[0], cfg.corner[1], { noAxles: cfg.noAxles, hlMeet: cfg.hlMeet })}</g></svg>`;
  if (cfg.stack) return s + `<g transform="translate(110 0) scale(.6)">${stackSVG(cfg.stack, cfg.len, { nums: true })}</g></svg>`;
  if (cfg.measure) {
    s += `<rect x="${bx - 26}" y="60" width="${8 * U + 52}" height="40" rx="20" fill="#3A4150"/>`;
    for (let n = 0; n < 9; n++) s += `<circle cx="${hx(n)}" cy="80" r="12" fill="#F3EFE6"/>`;
    for (let n = 0; n < 3; n++) s += `<line x1="${hx(n)}" y1="104" x2="${hx(n)}" y2="150" stroke="#F2A33A" stroke-width="3" stroke-dasharray="5 5"/><text x="${hx(n)}" y="215" text-anchor="middle" font-size="20" font-weight="800" fill="#1F2430" font-family="Nunito, sans-serif">${n + 1}</text>`;
    s += `<rect x="${hx(0) - 28}" y="160" width="${3 * U}" height="16" rx="3" fill="#1F2430"/>${[1, 2].map((i) => `<rect x="${hx(0) - 28 + i * U - 1}" y="160" width="2" height="16" fill="#9AA3B2"/>`).join('')}`;
    s += `<text x="${hx(3) + 10}" y="174" font-size="22" font-weight="800" fill="#1F2430" font-family="Baloo 2, sans-serif">= ${esc(t().axle)} 3</text>`;
    return s + '</svg>';
  }
  const hl = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  const beam = !cfg.noBeam;
  if (cfg.rack != null) { const rx = hx(cfg.rack) + 28; s += `<g transform="translate(0 ${-(cfg.rackUp || 0)})">${rackSVG(rx, 30, 230)}</g>`; if (cfg.rackUp) s += `<path d="M${rx + 50},150 v-60 M${rx + 42},100 l8,-12 l8,12" fill="none" stroke="#C93C3C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`; }
  if (cfg.worm != null) s += `<g transform="translate(${hx(cfg.worm)} ${by})">${wormBody(0, 'bw' + cfg.worm)}</g>`;
  if (cfg.table) s += `<rect x="0" y="${by + 30}" width="${hx(5)}" height="22" rx="4" fill="#C9A27A"/><rect x="${hx(5) - 30}" y="${by + 52}" width="20" height="100" fill="#B08560"/>`;
  if (beam) s += `<rect x="${bx - 26}" y="${by - 20}" width="${8 * U + 52}" height="40" rx="20" fill="#3A4150"/>`;
  if (beam) for (let n = 0; n < 9; n++) s += `<circle cx="${hx(n)}" cy="${by}" r="12" fill="#F3EFE6"/>` + (cfg.noNums ? '' : `<text x="${hx(n)}" y="${by + 112}" text-anchor="middle" font-size="15" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${n + 1}</text>`);
  if (cfg.hlBeam) s += `<rect x="${bx - 32}" y="${by - 26}" width="${8 * U + 64}" height="52" rx="26" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
  for (const h of cfg.axles || []) s += `<g transform="translate(${hx(h)} ${by})">${axleEnd()}</g>`;
  // Gears, turned so neighbouring teeth fit
  const gs = (cfg.gears || []).slice().sort((a, b) => a[0] - b[0]);
  let prev = null;
  for (const [h, tt] of gs) {
    let a = 0;
    if (prev && Math.abs((h - prev.h) * U - radius(prev.t) - radius(tt)) < 1) a = meshAngle(prev.a, prev.t, tt, 0);
    s += `<g transform="translate(${hx(h)} ${by}) rotate(${((a * 180) / Math.PI).toFixed(1)})">${gearSVG(tt)}</g>`;
    if (!beam) s += `<g transform="translate(${hx(h)} ${by})">${axleCross(8)}</g>`;
    if (cfg.arrows) s += `<g transform="translate(${hx(h)} ${by})">${dirArrow(radius(tt) + 12, (gs.indexOf(gs.find((g) => g[0] === h)) % 2 === 0) !== !!cfg.ccw, GEAR_COL[tt][1])}</g>`;
    prev = { h, t: tt, a };
  }
  if (cfg.string != null) { const sl = cfg.stringLen || 98; s += `<line x1="${hx(cfg.string) + 6}" y1="${by}" x2="${hx(cfg.string) + 6}" y2="${by + sl}" stroke="#7A4D20" stroke-width="3.5"/><g transform="translate(${hx(cfg.string) + 6} ${by + sl - 2})">${crate(50, 40)}</g>`; }
  if (cfg.crank) {
    const c = cfg.crank, x = hx(c.hole), Lp = 2 * U - 10;
    s += `<g transform="translate(${x} ${by}) rotate(-90)">${crankArm(Lp)}</g>`;
    if (c.hl === 'arm') s += `<rect x="${x - 22}" y="${by - Lp - 22}" width="44" height="${Lp + 44}" rx="22" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
    if (c.hl === 'pin') s += `<circle cx="${x}" cy="${by - Lp}" r="26" fill="none" stroke="#F2A33A" stroke-width="5" stroke-dasharray="8 6" class="pulse"/>`;
    if (c.turn) s += `<g transform="translate(${x} ${by})">${dirArrow(Lp + 26, true, '#C93C3C')}</g>`;
  }
  for (const [h, r] of cfg.hl || []) s += hl(bx + h * U, by, r);
  if (cfg.inset) {
    const L = t();
    s += `<g transform="translate(600 40)"><rect x="-10" y="-10" width="160" height="190" rx="16" fill="#FAF8F3" stroke="#E3DED3" stroke-width="2"/>
      <rect x="62" y="10" width="10" height="150" rx="2" fill="#1F2430"/>
      <rect x="24" y="44" width="86" height="12" rx="3" fill="#F2A33A" stroke="#B86E0F" stroke-width="2"/>
      <rect x="20" y="72" width="94" height="24" rx="8" fill="#3A4150"/>
      <rect x="48" y="112" width="38" height="18" rx="4" fill="#9AA3B2" stroke="#5B6270" stroke-width="2"/>
      <circle cx="67" cy="121" r="26" fill="none" stroke="#F2A33A" stroke-width="4" stroke-dasharray="6 5" class="pulse"/>
      <text x="70" y="30" text-anchor="middle" font-size="14" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${esc(L.front)} ↑</text>
      <text x="70" y="175" text-anchor="middle" font-size="14" font-weight="800" fill="#5B6270" font-family="Nunito, sans-serif">${esc(L.backSide)} ↓</text></g>`;
  }
  return s + '</svg>';
}
function renderBuild() {
  const L = t(), TL = tl(), B = S.build, BD = LS().build, nSteps = TL.b.length;
  let main = '';
  if (B.i === 0) {
    main = `<h2>${esc(L.findParts)}</h2><div class="pcards">${BD.parts.map(([k, n]) => `<button class="pcard" data-act="have" data-v="${k}" aria-pressed="${!!B.have[k]}">${icon(k, 64, 50)}<span class="cnt">×${n}</span><span class="nm">${esc(L[k])}</span></button>`).join('')}</div>
      <p class="note">${esc(L.missing)}</p><button class="btn big" data-act="bnext">${esc(L.haveAll)} →</button>`;
  } else if (B.i <= nSteps) {
    const si = B.i - 1;
    main = `<div class="dots" aria-hidden="true">${TL.b.map((_, k) => `<i class="${k === si ? 'on' : ''}"></i>`).join('')}</div>
      <p class="instr">${speakBtn()}<span>${si + 1}. ${esc(TL.b[si])}</span></p>${buildScene(BD.scenes[si], TL.b[si])}
      <div class="row"><button class="btn" data-act="bprev">← ${esc(L.back)}</button><button class="btn big" data-act="bnext">${esc(L.next)} →</button></div>`;
  } else if (B.i === nSteps + 1) {
    const ok = B.answer === BD.correct;
    const fb = B.answer == null ? '' : ok ? TL.right : TL.wrong;
    const opts = BD.answers === 'numbers'
      ? `<div class="answers">${(BD.nums || [1, 2, 3, 4]).map((n) => `<button data-act="answer" data-v="${n}" class="${B.answer === n ? (n === BD.correct ? 'right' : 'wrong') : ''}">${n}</button>`).join('')}</div>`
      : `<div class="answers">${TL.opts.map((txt, n) => `<button data-act="answer" data-v="${n}" class="wide ${B.answer === n ? (n === BD.correct ? 'right' : 'wrong') : ''}">${icon(BD.icons[n], 80, 70)}<span>${esc(txt)}</span></button>`).join('')}</div>`;
    main = `<p class="instr">${speakBtn()}<span>${esc(TL.testQ)}</span></p>${opts}
      <p class="feedback" role="status">${esc(fb)}</p>
      <div class="row"><button class="btn" data-act="bprev">← ${esc(L.back)}</button>${ok ? `<button class="btn big" data-act="bnext">${esc(L.finish)} →</button>` : ''}</div>`;
  } else {
    const hasNext = S.li + 1 < LESSONS.length;
    main = `<div class="badge">${icon(LS().badge, 110, 110)}</div><h2>${esc(L.done)}</h2><p class="instr">${esc(TL.tool)}</p>
      <div class="row">${hasNext ? `<button class="btn" data-act="map">${esc(L.toMap)}</button><button class="btn big" data-act="open" data-v="${S.li + 1}">${esc(L.nextLesson)} →</button>` : `<button class="btn big" data-act="map">${esc(L.toMap)}</button>`}</div>`;
  }
  app.innerHTML = header(true) + `<main class="build">${main}</main>`;
}

function render() {
  document.documentElement.lang = S.lang;
  document.body.classList.toggle('playing', S.screen === 'lesson' && S.step === 1);
  if (S.screen === 'map') return renderMap();
  if (S.step === 0) return renderIdea();
  if (S.step === 1) return renderPlay();
  return renderBuild();
}

// ---------- Actions ----------
let toastTimer = null;
function toast(msg) {
  S.toast = msg; renderPlay();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { S.toast = null; const el = document.querySelector('.toast'); if (el) el.remove(); }, 3200);
}
function structureChanged() {
  const p = S.play;
  S.an = analyze(p);
  p.prevLoad = null;
  if (p.motorOn && S.an.motorGear && S.an.info[S.an.motorGear.id].jam) return toast(t().jamToast);
  if (p.motorOn && S.an.stall) return toast(t().heavy);
  renderPlay();
}
function openLesson(li) {
  S.li = li; S.screen = 'lesson'; S.step = 0; S.win = false; S.panel = null; S.fails = 0; S.hintLevel = 0; S.toast = null;
  S.play = newPlay(li); S.an = null; S.build = { i: 0, have: {}, answer: null }; ideaA = 0;
  render();
}

app.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act, v = b.dataset.v, TL = tl(), p = S.play;
  if (['map', 'open', 'step', 'lang', 'bnext', 'bprev'].includes(act)) stopSpeech();
  switch (act) {
    case 'lang': S.lang = v; save(); render(); break;
    case 'map': S.screen = 'map'; render(); break;
    case 'open': openLesson(+v); break;
    case 'step': S.step = +v; S.panel = null; S.win = false; if (S.step === 2) { S.build.i = 0; S.build.answer = null; } render(); break;
    case 'speak':
      if (S.step === 0) speak(TL.idea + ' ' + TL.ideaSub);
      else if (S.build.i >= 1 && S.build.i <= TL.b.length) speak(TL.b[S.build.i - 1]);
      else speak(TL.testQ);
      break;
    case 'motor': p.motorOn = !p.motorOn; structureChanged(); break;
    case 'flip': p.reverse = !p.reverse; renderPlay(); break;
    case 'helpers': p.helpers = !p.helpers; renderPlay(); break;
    case 'test': {
      const prob = LS().check(p, S.an);
      if (!prob && LS().rounds && p.round < LS().rounds.length - 1) S.panel = 'round';
      else if (!prob) { S.win = true; S.panel = null; } else { S.fails++; S.panel = 'fail'; }
      renderPlay(); break;
    }
    case 'hint': S.hintLevel = Math.min(3, S.hintLevel + 1); S.panel = 'hint'; renderPlay(); break;
    case 'close': S.panel = null; renderPlay(); break;
    case 'nextRound': p.round++; p.axleLen = null; p.slotA = null; p.slotB = null; if (LS().resetRound) LS().resetRound(p); S.panel = null; S.fails = 0; S.hintLevel = 0; renderPlay(); break;
    case 'have': S.build.have[v] = !S.build.have[v]; renderBuild(); break;
    case 'bnext': {
      S.build.i++;
      const key = 'l' + (S.li + 1);
      if (S.build.i === TL.b.length + 2 && !S.done.includes(key)) { S.done.push(key); save(); }
      renderBuild(); break;
    }
    case 'bprev': S.build.i = Math.max(0, S.build.i - 1); S.build.answer = null; renderBuild(); break;
    case 'answer': S.build.answer = +v; renderBuild(); break;
  }
});

// ---------- Board: dragging parts in, turning gears, removing parts ----------
const dragLayer = document.getElementById('drag-layer');
let drag = null, turn = null, tap = null;

function svgPt(cx, cy) {
  const svg = document.getElementById('bsvg');
  const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}
function overBoard(cx, cy) {
  const b = document.getElementById('board');
  if (!b) return false;
  const r = b.getBoundingClientRect();
  return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
}

function tryDrop(kind, x, y) {
  const p = S.play, L = t();
  if (/^ax\d$/.test(kind)) { p.axleLen = +kind[2]; S.panel = null; renderPlay(); return; }
  if (LS().drop) { if (LS().drop(p, kind, x, y) !== false) { S.panel = null; renderPlay(); } return; }
  if (LS().type === 'corner') {
    // Drop near the motor axle end = slot A, near the fan axle end = slot B. A tap fills the first empty slot.
    const slot = x == null ? (!p.slotA ? 'A' : 'B') : (x < 470 || y > 250 ? 'A' : 'B');
    p['slot' + slot] = kind; S.panel = null; renderPlay(); return;
  }
  const left = LS().stock[kind] - (used(p)[kind] || 0);
  if (left <= 0) return toast(L.noneLeft);
  const nearestAxle = () => {
    let best = null, bd = U * 0.75;
    for (const a of p.axles) { const d = Math.hypot(holeX(a.hx) - x, holeY(a.hy) - y); if (d < bd) { bd = d; best = a; } }
    return best;
  };
  if (kind === 'axle') {
    const hx = Math.round((x - OX) / U), hy = Math.round((y - OY) / U);
    if (hx < 0 || hy < 0 || hx >= COLS || hy >= ROWS || Math.hypot(holeX(hx) - x, holeY(hy) - y) > U * 0.6) return toast(L.dropAxle);
    if (p.axles.some((a) => a.hx === hx && a.hy === hy)) return toast(L.dropAxle);
    p.axles.push({ id: 'a' + p.nextId++, hx, hy });
  } else if (kind === 'worm') {
    const hx = Math.round((x - OX) / U), hy = Math.round((y - OY) / U);
    if (hx < 0 || hy < 0 || hx >= COLS || hy >= ROWS || p.axles.some((a) => a.hx === hx && a.hy === hy)) return toast(L.dropAxle);
    const id = 'w' + p.nextId++;
    p.axles.push({ id, hx, hy, worm: true });
    p.gears.push({ id: 'g' + p.nextId++, axle: id, teeth: 1, worm: true });
  } else if (kind === 'crankS' || kind === 'crankL') {
    if (p.crank) return toast(L.oneCrank);
    const a = nearestAxle();
    if (!a) return toast(L.dropCrank);
    p.crank = { axle: a.id, len: kind === 'crankS' ? 1 : 2, kind };
    if (!p.gears.some((g) => g.axle === a.id)) p.gears.push({ id: 'h' + p.nextId++, axle: a.id, teeth: 1, hidden: true });
  } else if (kind === 'motor') {
    const a = nearestAxle();
    if (!a) return toast(L.dropMotor);
    p.motor = a.id;
  } else {
    const a = nearestAxle();
    if (!a) return toast(L.dropGear);
    p.gears = p.gears.filter((g) => !(g.hidden && g.axle === a.id));
    if (p.gears.some((g) => g.axle === a.id)) return toast(L.full);
    if (a.worm) return toast(L.full);
    p.gears.push({ id: 'g' + p.nextId++, axle: a.id, teeth: +kind.slice(1) });
  }
  p.sel = null;
  structureChanged();
}

function removeSel() {
  const p = S.play, sel = p.sel;
  if (!sel) return;
  if (sel.kind === 'gear') {
    const g = p.gears.find((x) => x.id === sel.id);
    p.gears = p.gears.filter((x) => x.id !== sel.id);
    if (g && g.worm) { if (p.motor === g.axle) { p.motor = null; p.motorOn = false; } p.axles = p.axles.filter((a) => a.id !== g.axle); }
    if (g && p.crank && p.crank.axle === g.axle) p.gears.push({ id: 'h' + p.nextId++, axle: g.axle, teeth: 1, hidden: true });
  }
  if (sel.kind === 'crank') { const ax = p.crank.axle; p.crank = null; p.gears = p.gears.filter((g) => !(g.hidden && g.axle === ax)); }
  if (sel.kind === 'axle') {
    p.gears = p.gears.filter((g) => g.axle !== sel.id);
    if (p.motor === sel.id) { p.motor = null; p.motorOn = false; }
    if (p.crank && p.crank.axle === sel.id) p.crank = null;
    p.axles = p.axles.filter((a) => a.id !== sel.id);
  }
  if (sel.kind === 'motor') { p.motor = null; p.motorOn = false; }
  p.sel = null;
  structureChanged();
}

document.addEventListener('pointerdown', (e) => {
  if (S.screen !== 'lesson' || S.step !== 1 || S.panel || S.win) return;
  const hb = e.target.closest('[data-hold]');
  if (hb) { e.preventDefault(); const [f, d] = hb.dataset.hold.split(':'); S.play.hold = { f, dir: +d, warned: false }; hb.classList.add('on'); return; }
  const item = e.target.closest('.titem');
  if (item) { e.preventDefault(); drag = { kind: item.dataset.part, x0: e.clientX, y0: e.clientY, moved: false, el: null }; return; }
  const svg = document.getElementById('bsvg');
  if (!svg || !svg.contains(e.target)) return;
  e.preventDefault();
  const p = S.play;
  if (e.target.closest('[data-del]')) { removeSel(); return; }
  if (LS().type) {
    if (LS().type === 'lever') {
      const lv = e.target.closest('[data-lever]'), hole = e.target.closest('[data-hole]');
      if (lv) { p.levDrag = true; p.levWarned = false; try { svg.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } return; }
      if (hole && p.levA === 0) { const h = +hole.dataset.hole; if (h >= 1 && h <= 9) { setPivot(p, h); drawBoard(); } }
      return;
    }
    const ms = e.target.closest('[data-mslot]');
    if (ms) { p.slots[ms.dataset.mslot] = null; drawBoard(); return; }
    // Corner lesson: tap a placed gear to take it off.
    const sl = e.target.closest('[data-cslot]');
    if (sl) { S.play['slot' + sl.dataset.cslot] = null; renderPlay(); }
    return;
  }
  const cEl = e.target.closest('[data-cid]');
  const gEl = cEl ? null : e.target.closest('[data-gid]'), aEl = e.target.closest('[data-aid]'), mEl = e.target.closest('[data-mid]');
  if (cEl) {
    const g = S.an.gs.find((x) => x.axle === p.crank.axle), pt = svgPt(e.clientX, e.clientY);
    turn = { g, last: Math.atan2(pt.y - g.y, pt.x - g.x), total: 0, warned: false };
    tap = { kind: 'crank', id: 'crank' };
    try { svg.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    return;
  }
  if (mEl) { tap = p.motorFixed ? { fixed: true } : { kind: 'motor', id: 'motor' }; return; }
  if (gEl) {
    const g = S.an.gs.find((x) => x.id === gEl.dataset.gid), pt = svgPt(e.clientX, e.clientY);
    turn = { g, last: Math.atan2(pt.y - g.y, pt.x - g.x), total: 0, warned: false };
    tap = { kind: 'gear', id: g.id };
    try { svg.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    return;
  }
  if (aEl) { const a = p.axles.find((x) => x.id === aEl.dataset.aid); tap = a && a.fixed ? { fixed: true } : { kind: 'axle', id: aEl.dataset.aid }; return; }
  if (p.sel) { p.sel = null; drawBoard(); }
});

document.addEventListener('pointermove', (e) => {
  if (drag) {
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) {
      drag.moved = true;
      drag.el = document.createElement('div');
      drag.el.className = 'dragging';
      const big = drag.kind[0] === 'g' ? radius(+drag.kind.slice(1)) * 2.2 : 64;
      drag.el.innerHTML = icon(drag.kind, big, big);
      dragLayer.appendChild(drag.el);
    }
    if (drag.el) { drag.el.style.left = e.clientX + 'px'; drag.el.style.top = e.clientY + 'px'; }
    return;
  }
  if (S.play && S.play.levDrag) {
    const p = S.play, r = LS().rounds[p.round], pt = svgPt(e.clientX, e.clientY);
    const px = LEV.x0 + p.pivot * U;
    let a = Math.atan2(pt.y - LEV.y, pt.x - px);
    a = Math.max(0, Math.min(LEV.maxA, a));
    if ((r.w * p.pivot) / (10 - p.pivot) > 1.001) {
      p.shakeBox = a > 0.05; p.levA = 0;
      if (a > 0.15 && !p.levWarned) { p.levWarned = true; toast(t().tooHeavyPush); }
    } else {
      p.levA = a; p.shakeBox = false;
      if (p.pivot * U * Math.sin(a) >= r.flag - 1) p.reached = true;
    }
    drawBoard();
    return;
  }
  if (turn) {
    const g = turn.g, an = S.an, inf = an.info[g.id];
    const pt = svgPt(e.clientX, e.clientY), a = Math.atan2(pt.y - g.y, pt.x - g.x);
    let d = a - turn.last; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
    turn.last = a; turn.total += Math.abs(d);
    if (turn.total > 0.08) tap = null;
    if (inf.jam) return;
    // Heavy box: a finger is only strong enough with enough gearing.
    if (!canTurn(an, g)) {
      if (!turn.warned && turn.total > 0.3) { turn.warned = true; toast(inf.locked && !g.worm ? t().locked : t().heavyHand); }
      return;
    }
    S.play.phis[inf.root] = (S.play.phis[inf.root] || 0) + d / inf.k;
  }
});

document.addEventListener('pointerup', (e) => {
  if (S.play && S.play.hold) { S.play.hold = null; document.querySelectorAll('.hold.on').forEach((b) => b.classList.remove('on')); }
  if (S.play && S.play.levDrag) { S.play.levDrag = false; S.play.shakeBox = false; drawBoard(); }
  if (drag) {
    const d = drag; drag = null;
    if (d.el) d.el.remove();
    if (d.moved) { if (overBoard(e.clientX, e.clientY)) { const pt = svgPt(e.clientX, e.clientY); tryDrop(d.kind, pt.x, pt.y); } }
    else {
      // Tap on a tray part: place it on the next ghost spot if it matches.
      const ng = nextGhost(S.play);
      const key = ng ? (ng.type === 'gear' ? 'g' + ng.teeth : ng.type) : null;
      if (/^ax\d$/.test(d.kind) || LS().type === 'corner' || LS().drop) tryDrop(d.kind, null, null);
      else if (key === d.kind) tryDrop(d.kind, holeX(ng.hx), holeY(ng.hy)); else toast(t().dragTip);
    }
    return;
  }
  if (turn && S.an.info[turn.g.id] && S.an.info[turn.g.id].jam && turn.total > 0.08) toast(t().jamToast);
  turn = null;
  if (tap) {
    const p = S.play;
    if (tap.fixed) { tap = null; return; }
    const same = p.sel && p.sel.kind === tap.kind && p.sel.id === tap.id;
    p.sel = same ? null : { kind: tap.kind, id: tap.id };
    tap = null;
    drawBoard();
  }
});
document.addEventListener('pointercancel', () => { if (drag && drag.el) drag.el.remove(); drag = null; turn = null; tap = null; });

// ---------- Animation ----------
let lastT = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  if (S.screen === 'lesson' && S.step === 0) tickIdea(dt);
  if (S.screen === 'lesson' && S.step === 1 && LS().type === 'corner') tickCorner(dt, S.play.slotA, S.play.slotB);
  if (S.screen === 'lesson' && S.step === 1 && LS().tick && !S.win) LS().tick(S.play, dt);
  if (S.screen === 'lesson' && S.step === 1 && S.an) {
    const p = S.play, an = S.an;
    const mg = an.motorGear;
    if (p.motorOn && mg && !an.info[mg.id].jam && !an.stall) {
      let step = (p.reverse ? -1 : 1) * (LS().motorDir || 1) * (LS().motorSpeed || MOTOR_SPEED) * dt;
      // Box at the flag or on the floor: the motor stops pulling.
      if (an.loadGear && an.info[an.loadGear.id].root === mg.id) {
        const dl = -an.info[an.loadGear.id].k * step * liftRate(an);
        if ((dl > 0 && p.lift >= MAX_LIFT) || (dl < 0 && p.lift <= 0)) step = 0;
      }
      p.phis[mg.id] = (p.phis[mg.id] || 0) + step;
    }
    // Lesson 7: without a lock, the heavy box falls back down.
    if (LS().gravity && an.loadGear && p.lift > 0) {
      const il = an.info[an.loadGear.id];
      const driven = p.motorOn && mg && il.root === mg.id && !an.stall && !il.jam;
      const held = turn && an.info[turn.g.id] && an.info[turn.g.id].root === il.root;
      if (!driven && !il.locked && !held && !il.jam) {
        if (p.lift >= MAX_LIFT - 2) p.fellBack = true;
        const fall = Math.min(p.lift, 160 * dt);
        p.phis[il.root] = (p.phis[il.root] || 0) + fall / liftRate(an) / il.k;
      }
    }
    for (const g of an.gs) {
      const a = gearAngle(an, p, g);
      p.ang[g.id] = a;
      const el = document.getElementById('rot-' + g.id);
      if (el && g.worm) { const th = el.querySelector('.wthreads'); if (th) th.setAttribute('transform', `translate(0 ${(((((a / TAU) * 14) % 14) + 14) % 14).toFixed(1)})`); }
      else if (el) el.setAttribute('transform', `rotate(${((a * 180) / Math.PI).toFixed(2)})`);
      if (p.crank && p.crank.axle === g.axle) { const c = document.getElementById('crank'); if (c) c.setAttribute('transform', `rotate(${((a * 180) / Math.PI).toFixed(2)})`); }
    }
    if (!an.loadGear && LS().gravity && p.lift > 0) { if (p.lift >= MAX_LIFT - 2) p.fellBack = true; p.lift = Math.max(0, p.lift - 160 * dt); const box = document.getElementById('box'), rope = document.getElementById('rope'); if (box) { box.setAttribute('transform', `translate(${rope.getAttribute('x1')} ${boxTop(p)})`); rope.setAttribute('y2', boxTop(p)); } }
    if (an.loadGear) {
      const a = p.ang[an.loadGear.id];
      if (p.prevLoad != null) {
        // With a hand crank the string winds up whichever way you turn (kid-friendly winch).
        const dA = a - p.prevLoad, rate = liftRate(an);
        p.lift = Math.max(0, Math.min(MAX_LIFT, p.lift + (LS().noMotor ? Math.abs(dA) : -dA) * rate));
      }
      if (p.lift >= MAX_LIFT - 2 && !p.atFlag && LS().noMotor) { p.atFlag = true; turn = null; toast(t().atFlag); }
      p.prevLoad = a;
      const rk = document.getElementById('rack'); if (rk) rk.setAttribute('transform', `translate(0 ${(-p.lift).toFixed(1)})`);
      const box = document.getElementById('box'), rope = document.getElementById('rope');
      if (box) { box.setAttribute('transform', `translate(${rope.getAttribute('x1')} ${boxTop(p)})`); rope.setAttribute('y2', boxTop(p)); }
    }
  }
  requestAnimationFrame(frame);
}

render();
requestAnimationFrame(frame);
