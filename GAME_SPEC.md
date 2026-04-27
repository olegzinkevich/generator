# Game Specification

## Meta
- **Title:** FlexyMind
- **Category:** Puzzle
- **Screen Orientation:** the game should be playable in album AND portrait orientation
- **Platforms:** the game should be available in mobile AND desktop platforms
- **Framework:** React
- **Game Code Path:** Use this reference game code and edit it: `D:\dev\yandex_game_test_generation`
- **Yandex Metrika Counter ID:** 111
- **Testing Checklist:** `D:\dev\yandex_game_test_generation\Testing_checklist.md`

## Game Description
browser brain-training game with clear logic, progression, scoring, and challenge modes. The concept aligns well with task-switching and cognitive flexibility games, which are commonly designed around rapid rule changes, fast responses, and adaptive difficulty.

Game concept
Rule Shift is a fast-paced brain-training puzzle game where the player must constantly adapt to changing rules. Every 10–20 seconds, the active rule switches, so the same board suddenly means something different: tap the biggest shape, then tap the one that appears twice, then tap the one farthest left. The main skill is not speed alone, but switching attention quickly and keeping the current rule in working memory.

Core gameplay
Each round presents 4–8 simple objects on screen, such as shapes, symbols, colored tiles, numbers, or icons. A rule card at the top tells the player what to do, for example: “Tap the smallest,” “Tap the only blue one,” or “Tap the item closest to the center.” After a short number of correct actions, the rule changes automatically and the player must instantly adjust.

The game should feel fair, readable, and tense rather than random. A new rule is announced with a short visual transition, a subtle sound cue, and a 1–2 second grace moment before the first valid target appears. That makes the game feel like a logic test, not a reaction trap.

Game logic
The logic can be built around a rule engine that selects one active rule from a pool and generates board items that can satisfy that rule. Each rule has a target, a difficulty weight, and optional modifiers, such as increasing item count or adding distractors. The system should avoid impossible boards and should always guarantee at least one valid answer.

A simple loop could be:

Show current rule.

Generate a board with one or more valid targets.

Player taps the correct item.

Award points and combo bonus.

After time or after a set number of correct taps, switch the rule.

Repeat until mistakes or timer end.

To keep it interesting, rules can be grouped by type:

Spatial: farthest left, closest to center, topmost, largest area.

Visual: rare color, duplicated item, matching pair.

Counting: appears twice, contains 3 corners, has two dots.

Logic: opposite of the previous rule, choose the item that was not tapped last time.

Main screens
Home screen
The home screen should be minimal and inviting, with a large Play button, a visible best score, and a short explanation of the current day’s challenge. Add a “Training mode” and “Challenge mode” entry so users understand there is both casual play and structured progression. A small animated preview of changing rules would make the idea instantly clear.

Mode select
This screen can offer 3–4 modes: Classic, Daily, Endless, and Challenge Pack. Classic is the main loop, Daily gives one seeded run per day, Endless is for high scores, and Challenge Packs are short goal-based sets focused on one skill like attention switching or spatial reasoning.

Gameplay screen
This is the core view: rule panel at top, board in center, progress bar or timer below, and score/combo display in a corner. The UI should stay extremely clean because clutter would undermine the training purpose. Use large tap targets and subtle animations so the game works well on mobile browser too.

Results screen
Show performance summary: score, accuracy, reaction time, longest combo, and number of rule switches survived. It helps to add a “brain profile” panel, such as Flexibility, Focus, and Speed, so users feel progression beyond a single score. A retry button and a “beat your best” prompt should be prominent.

Controls
The controls should be as simple as possible:

Tap or click the correct item.

Optional keyboard mode for desktop, using number keys or arrow keys.

Long press or spacebar could pause in practice mode.

Accessibility toggle for larger UI and reduced motion.

Keeping the input model simple is important because the challenge should come from rule changes, not awkward controls.

Scoring system
A good scoring model should reward both accuracy and adaptation speed. For example:

Correct tap: +10 points.

Fast correct tap within the bonus window: +5 to +15 extra.

Streak bonus: multiplier increases after every 3 or 5 correct taps.

Rule switch bonus: extra points for the first correct tap after a change.

Perfect round bonus: no mistakes during a full rule set.

You can also subtract points for wrong taps or missed taps, but it is usually better to use limited mistakes or lives instead of harsh penalties. That keeps the game motivating and avoids making it feel punishing.

Difficulty progression
Difficulty should scale in layers, not just by making everything faster. For example:

Start with 2–4 items on screen and long rule durations.

Add more items and shorter recognition windows.

Introduce similar-looking distractors.

Mix in compound rules, like “tap the biggest blue shape.”

Add rule reversals and “no-go” rules, such as “tap everything except the square.”

This kind of progressive variety is valuable because research on game-based cognitive training suggests that switching between rules and attention demands is central to the flexibility challenge.

Challenge modes
Yes — the game should absolutely have challenge modes, because they create retention and give players a reason to return. A few strong options are:

Daily Shift: one fixed seed per day, leaderboard-based.

Sprint: 60-second run, pure speed.

Endurance: as many rule switches as possible with limited lives.

Precision Mode: fewer items, but stricter accuracy requirements.

Boss Mix: every 5th rule includes a twist, like reversed color logic or double conditions.

You can also add weekly challenge packs focused on specific brain skills, such as attention, memory, or flexibility. That makes the game feel like a training system rather than a one-off arcade toy.

Retention hooks
To keep people coming back, add:

Daily streaks and calendar rewards.

Level stars based on accuracy, speed, and combo length.

Unlockable themes, shapes, and rule sets.

A “brain age” or “flexibility score” dashboard.

Personal bests by mode, so users can chase improvement.

A good example would be: if a player completes three daily runs with 90%+ accuracy, they unlock a harder rule set with visual decoys and shorter switch intervals. That creates a clear sense of mastery without needing complex content.

## Keywords
пазл, логическая игра, тренировка мозга, игра на внимание, быстрая реакция, адаптивная сложность, правила игры, интеллектуальная игра, мозговой штурм, игра на память

## Onboarding Screens
Change the existing onboarding screens with these if they differ in reference code:

### Russian (source)
#### Screen 1
**Question:** Как много времени у вас на игру?

1. <3 мин.
2. 5-10 мин.
3. >15 мин.

#### Screen 2
**Question:** Играли ли Вы раньше в головоломки?

1. Да, много раз
2. Играл иногда
3. Почти не играл

## Assets
- Logo: `./public/logo.png`
- Maskable Icon: `./public/maskable.png`
- Catalog Cover: `./public/cover.png`

## Localization
The game should be localized (i18n) in these languages: Russian, Spanish

### Russian

#### SEO Text
"Rule Shift" — увлекательная головоломка, где изменяющиеся правила требуют быстрой адаптации. Тренируйте мозг, проходите уровни и соревнуйтесь с друзьями!

#### About the game
Rule Shift — это увлекательная браузерная игра-головоломка, которая тренирует ваш разум и развивает когнитивные навыки. В этой быстрой игре вам предстоит постоянно адаптироваться к меняющимся правилам, которые обновляются каждые 10-20 секунд. На экране появляются 4–8 простых объектов, а карта правил указывает, что делать: «Тапните на самый маленький» или «Тапните на синий». Успех зависит не только от скорости, но и от способности быстро переключать внимание и удерживать в памяти текущее правило. Игра предлагает несколько режимов, включая классический, ежедневные вызовы и бесконечный режим для достижения высоких результатов. В каждом раунде вам предстоит набирать очки, соблюдая правила и преодолевая сложности. Сразитесь с друзьями в режиме PvP или попробуйте свои силы в режиме «Спринт» на скорость! Rule Shift — это не просто игра, а уникальный способ тренировки вашего мозга.

#### How to play
Игра 'Rule Shift' — это быстрая головоломка, в которой вам нужно адаптироваться к меняющимся правилам. Каждые 10–20 секунд правило меняется, и вам нужно быстро переключать внимание. На экране появится 4–8 простых объектов, а карточка с правилом вверху подскажет, что делать: 'Нажмите на самый маленький' или 'Нажмите на синий'. После нескольких правильных действий правило автоматически изменится. Контролируйте игру с помощью простого нажатия на экран или клавиш. Система начисляет очки за правильные нажатия и бонусы за скорость. Игра состоит из нескольких режимов: классический, ежедневный, бесконечный и наборы заданий. В каждом режиме вы будете сталкиваться с новыми правилами и задачами, что делает игру увлекательной. Прогрессируйте, улучшая свои навыки, и стремитесь к новым рекордам в таблице лидеров.

### Spanish

#### SEO Text
"Rule Shift" — un emocionante rompecabezas donde las reglas cambian y requieren adaptación rápida. ¡Entrena tu mente, supera niveles y compite con amigos!

#### About the game
Rule Shift es un emocionante juego de navegador de rompecabezas que entrena tu mente y desarrolla habilidades cognitivas. En este juego rápido, deberás adaptarte constantemente a las reglas cambiantes que se actualizan cada 10-20 segundos. En la pantalla aparecen de 4 a 8 objetos simples, mientras que el mapa de reglas indica qué hacer: "Toca el más pequeño" o "Toca el azul". El éxito depende no solo de la velocidad, sino también de la capacidad de cambiar la atención rápidamente y recordar la regla actual. El juego ofrece varios modos, incluidos el clásico, desafíos diarios y un modo infinito para alcanzar puntuaciones altas. En cada ronda, deberás ganar puntos siguiendo las reglas y superando dificultades. ¡Compite con amigos en el modo PvP o pon a prueba tus habilidades en el modo "Sprint" a toda velocidad! Rule Shift no es solo un juego, sino una forma única de entrenar tu cerebro.

#### How to play
El juego 'Rule Shift' es un rompecabezas rápido en el que debes adaptarte a las reglas cambiantes. Cada 10-20 segundos, la regla cambia y necesitas cambiar tu atención rápidamente. En la pantalla aparecerán de 4 a 8 objetos simples, y una tarjeta con la regla en la parte superior te indicará qué hacer: 'Toca el más pequeño' o 'Toca el azul'. Después de varias acciones correctas, la regla cambiará automáticamente. Controla el juego con un simple toque en la pantalla o con teclas. El sistema otorga puntos por toques correctos y bonificaciones por velocidad. El juego incluye varios modos: clásico, diario, infinito y conjuntos de tareas. En cada modo, te enfrentarás a nuevas reglas y desafíos, lo que hace que el juego sea emocionante. Progresas mejorando tus habilidades y persiguiendo nuevos récords en la tabla de líderes.

---

## Instructions for Claude

You are given a reference game codebase in the folder defined in "Game Code Path". Update it to match the specification above:

0. Read the testing checklist at `D:\dev\yandex_game_test_generation\Testing_checklist.md` and follow all checks and instructions when generating and verifying the game.
1. Set the game title, description, and metadata in the appropriate config / manifest files.
2. Wire up the Yandex Games SDK — use the orientation, platform, and metrika counter values.
3. Place the provided assets (logo, maskable icon, cover) in the correct locations.
4. Implement i18n localization for all listed languages (localize all game strings, necessary assets, button texts, messages, onboarding screens, etc.).
5. Implement the onboarding screens as described — each screen has a question title and selectable options.
6. If reference screenshots are listed, READ each image file using the Read tool to view them. Analyze the color palette, art style, UI layout, and design patterns. Apply these as visual style guidance for any generated UI, theme colors, and overall aesthetic.
7. Use the specified framework for the implementation.
