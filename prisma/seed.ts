import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const stories = [
  {
    title: "The Adventure of the Speckled Band",
    author: "Arthur Conan Doyle",
    genre: "mystery",
    themes: ["courage", "justice", "discovery"],
    wordCount: 1800,
    originalText: `Helen Stoner came to Baker Street in a state of great agitation. Her stepfather, Dr. Grimesby Roylott, had returned from India with a violent temper and a strange menagerie of exotic animals. Her twin sister Julia had died mysteriously two years before, uttering her last words: "the speckled band."

Helen was now engaged to be married, and strange things had begun to happen. She heard low whistling in the night, and her room had been moved to her late sister's chamber. Sherlock Holmes listened carefully and agreed to investigate at once.

At Stoke Moran, Holmes examined the bedroom meticulously. He noticed the bed was bolted to the floor, a ventilator opened to the next room rather than outside, and a bell-pull that was not connected to anything — merely a dummy. On the bedside sat a saucer of milk.

That night, Holmes and Watson kept watch in the dark room. At three in the morning, Holmes struck a match and attacked the bell-pull with his cane. A terrible cry came from the next room. When they broke in, Dr. Roylott sat dead in his chair — a speckled band of yellow and brown coiled around his brow. It was a swamp adder, the deadliest snake in India, trained to crawl through the ventilator and down the dummy bell-pull to the bed.

Holmes had driven it back with his cane, and it had turned on its master. Justice, in this case, had been swift and fitting.`,
  },
  {
    title: "The Gift of the Magi",
    author: "O. Henry",
    genre: "romance",
    themes: ["love", "sacrifice", "friendship"],
    wordCount: 1200,
    originalText: `Della counted her money three times. One dollar and eighty-seven cents. That was all, and tomorrow was Christmas. She had saved every penny she could for months, and this was the result.

She had two great possessions: her long, beautiful chestnut hair that fell below her knees, and Jim's gold watch — a treasure passed down from his grandfather. Both were things they were enormously proud of.

Without a word to anyone, Della went to a hairdresser's shop. "Will you buy my hair?" she asked. Twenty dollars. She took it and began to shop for a present for Jim. At last she found it — a platinum chain for his watch, simple and fine. Twenty-one dollars. It took all the money.

Jim came home that evening and stopped short at the door, staring at Della with a strange expression — not anger, not surprise, but something she could not read.

"Jim, darling," she cried, "don't look at me that way. I had my hair cut off and sold it. I just had to give you something wonderful for Christmas."

Jim pulled out a package and held it toward her. Inside were beautiful tortoise shell combs, side and back — combs she had longed for. And now her hair was gone.

But Jim reached into his coat. He had sold his watch to buy her combs.

They were two foolish children who had sacrificed for each other the greatest treasures of their house. But in all the city, no two gave gifts so wise as these.`,
  },
  {
    title: "Cinderella",
    author: "Brothers Grimm",
    genre: "fairy_tale",
    themes: ["courage", "love", "justice"],
    wordCount: 1500,
    originalText: `There was once a rich man whose wife lay sick, and when she felt her end drawing near she called her only daughter to her bedside and said, "Dear child, be good and pious, and then the good God will always protect you, and I will look down on you from heaven and be near you."

After her mother passed, the girl went every day to weep by her grave. When winter came, the snow spread a white covering over the grave, and by the time the spring sun had drawn it off again, the man had taken another wife who brought her two daughters — beautiful of face but vile and black of heart.

The stepmother gave the girl nothing but a grey frock and wooden shoes, saying, "Look at the proud princess, how decked out she is!" And they took away her fine clothes and made her work from morning till night, rising before daybreak and carrying water, lighting fires, cooking, and washing.

One day the father went to a fair and asked all three daughters what he should bring back. The two stepsisters asked for beautiful dresses and pearls, but the girl said only, "Father, break off for me the first branch that brushes against your hat on your way home."

He brought back a hazel twig. She planted it on her mother's grave, and watered it with her tears. It grew into a beautiful tree, and a white bird came to it that granted any wish she made.

When the king's festival came, the stepmother forbade the girl from attending. But three times she went to the hazel tree, and three times the bird gave her a more beautiful gown. At midnight she fled, losing her golden slipper on the stair.

The prince traveled the kingdom searching for the girl whose foot fit the shoe. When he came to the house, neither stepsister's foot would fit. Then the girl tried it — and it slipped on perfectly.

She was taken to the palace, and they were married. As for the stepsisters, the birds came down and pecked out their eyes for their wickedness. And so they had to live out their days in blindness as punishment for their deceit.`,
  },
  {
    title: "The Celebrated Jumping Frog of Calaveras County",
    author: "Mark Twain",
    genre: "adventure",
    themes: ["discovery", "friendship", "courage"],
    wordCount: 1400,
    originalText: `In compliance with the request of a friend of mine, who wrote me from the East, I called on good-natured, garrulous old Simon Wheeler. I found him asleep by the stove and woke him up.

"Pardon me," said I, "do you know a fellow named Jim Smiley?"

He never smiled. He just started talking. Smiley, he said, was the curiousest man about always betting on anything that turned up. If there was a horse race, you'd find him flush or busted at the end of it. If there was a cat fight, he'd bet on it. Whatever suited the other man, Smiley was satisfied.

Smiley had a little small bull pup that would look mighty savage to a stranger, but when the bet was arranged and money was down, he'd grab the other dog by the hind leg and freeze to it till the other dog gave up — he never lost.

But Smiley's greatest prize was a frog. He called him Dan'l Webster. He spent three months educating that frog to jump. You never see a frog so modest and straightforward as Dan'l was.

A stranger come to camp once, and Smiley offered to bet him Dan'l could outjump any frog in Calaveras County. The stranger had no frog. Smiley went off to find one in the swamp.

While he was gone, the stranger filled Dan'l full of quail shot by the spoonful. When Smiley came back, Dan'l gave a heave, but couldn't budge. The stranger picked up his money and walked off.

Smiley scratched his head, picked up Dan'l, turned him upside down, and out poured a double handful of shot. He set down the frog and never tried to catch that stranger — he was too dumbfounded.`,
  },
  {
    title: "The Time Machine (Excerpt)",
    author: "H.G. Wells",
    genre: "sci_fi",
    themes: ["discovery", "courage", "justice"],
    wordCount: 1600,
    originalText: `The Time Traveller — for so it will be convenient to speak of him — was expounding a recondite matter to us. His eyes sparkled and his face was animated. The fire burned brightly and the soft radiance of the lamp illuminated his strong, earnest face.

"You must follow me carefully," he said. "I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception. Can a cube exist for an instant? Clearly, it must have extension in time as well as space."

A week later he arrived disheveled, pale, with a cut on his chin. He sat down and ate ravenously. When he finished, he began his tale.

He had sat in his machine, closed the brass lever, and felt a sickening sensation. Day followed night followed day in a rush. He accelerated further, and the whole world seemed fluid. At last he stopped.

Before him lay a landscape of great beauty — and strangeness. Pale golden buildings covered with vine, a sweet smell in the warm air. Beautiful but frail creatures, child-sized and delicate, came to meet him. The Eloi, he would call them. They lived in communal buildings, ate fruit, and spoke in a soft language.

But there were others. At night the Morlocks emerged from underground — pale, ape-like beings who maintained the machinery that clothed and fed the Eloi. And they also fed upon them.

He understood at last: mankind had split into two races. The idle owners had become the Eloi, beautiful and helpless. The laborers had gone underground and become predators.

He set the lever and fled back to his own time, shaken by what civilisation might become.`,
  },
  {
    title: "Rip Van Winkle",
    author: "Washington Irving",
    genre: "historical",
    themes: ["discovery", "friendship", "courage"],
    wordCount: 1500,
    originalText: `In a village nestled among the Catskill Mountains there lived a simple, good-natured fellow named Rip Van Winkle. He was a kind neighbor, ready to help anyone, beloved by children and dogs alike. His wife, however, was a sharp-tongued woman who kept him in a constant state of domestic misery.

To escape her tongue, Rip would take his dog Wolf and his gun into the mountains. One autumn afternoon he wandered high up into the wildest part of the Catskills, where he heard his name called and found a short, square-built old fellow in antique Dutch clothing struggling under a keg.

Rip helped carry the keg to a hollow in the mountain where a strange group of odd-looking men played nine-pins in silence. He drank deeply from a flagon they passed him, and fell into a deep sleep.

When he woke, his gun was rusted, his dog was gone, his beard had grown a foot long. He stumbled down to his village to find it changed beyond recognition. The children who ran around him were strangers. His house had fallen to ruin.

"Does nobody know Rip Van Winkle?" he cried. An old woman peered at him. "Rip Van Winkle! He went into the mountain twenty years ago and was never heard of again."

Twenty years had passed. His wife was dead. His daughter had married. The country itself had changed — King George was gone, and the new nation had been born.

Rip was welcomed by the village as a relic from the past, took up his place with his daughter's family, and told his tale to every stranger who came. The only disadvantage he found in returning was — he had a wife no longer.`,
  },
  {
    title: "The Necklace",
    author: "Guy de Maupassant",
    genre: "romance",
    themes: ["justice", "courage", "discovery"],
    wordCount: 1400,
    originalText: `Mathilde Loisel was pretty and charming, born as if by a slip of fate into a family of clerks. She had no dowry, no prospects, no way to meet a rich man. She married a minor government employee.

She suffered ceaselessly, feeling born for luxury. When her husband brought home an invitation to a ball at the Ministry of Education, she wept — she had nothing to wear. He gave her four hundred francs, his savings for a gun.

She borrowed a diamond necklace from her friend Madame Forestier. At the ball she was the most elegant woman there, gracious, smiling, wild with joy.

But when they reached home, she looked in the mirror — the necklace was gone. They searched everywhere. Her husband retraced every step. Nothing.

They replaced it. Thirty-six thousand francs. They dismissed their servants, moved to an attic, worked like horses. Ten years of grueling poverty to pay back what they had borrowed.

One Sunday in the Champs-Elysées, Mathilde saw Madame Forestier, still young, still beautiful. She approached her.

"Good morning, Jeanne."

Her friend did not recognize her. "Madame... I don't know... you must be mistaken."

"No. I am Mathilde Loisel."

Madame Forestier was astonished. "Oh, my poor Mathilde! How you have changed!"

"Yes, I've had hard days since I last saw you — and that because of you!"

"Of me? How so?"

"You remember the diamond necklace you lent me for the Ministry ball? I lost it."

"But — I gave you back a diamond necklace!"

"Yes. And it's cost us ten years' work to pay for it. You can imagine how glad we are — we never had the money before."

Madame Forestier stopped short. "Oh, my poor Mathilde. Mine was paste. Worth at most five hundred francs."`,
  },
  {
    title: "The Little Mermaid",
    author: "Hans Christian Andersen",
    genre: "fairy_tale",
    themes: ["love", "courage", "sacrifice"],
    wordCount: 2000,
    originalText: `Far out to sea the water is as blue as the petals of the most beautiful cornflower. The sea-folk lived there in the deepest part, in the palace of the Sea King whose six daughters had tails of fish and hair of sea-gold.

The youngest was the most beautiful, and the most wistful. She would sit for hours watching the world above the water, where ships passed and seabirds flew. On her fifteenth birthday she was permitted to rise to the surface.

She saw a great ship and looked through the cabin window at a young prince — dark-eyed and barely sixteen — celebrating his birthday. A storm broke, and the ship was lost. The mermaid caught the prince and bore him to shore, laying him on the sand, then swimming away before he could see her.

She could not forget him. She asked her grandmother: "If humans die, can they live forever?" "Yes," said her grandmother, "but merfolk dissolve into sea foam when they die, unless they win a human's love."

She went to the Sea Witch, who took her voice in exchange for legs. But every step she took felt like walking on sharp knives. And if the prince married another, she would dissolve at dawn.

The prince liked her above all others, but he loved the woman who had found him on the shore — or so he thought. He married that woman.

Her sisters came at dawn with a knife from the Sea Witch. If she plunged it into the prince's heart before sunrise, she would become a mermaid again. She stood over him — and then threw the knife into the sea and walked to the ship's railing to meet the foam.

But instead she rose among the daughters of the air, spirits who can earn a soul through three hundred years of good deeds. And she began her long, gentle work.`,
  },
  {
    title: "To Build a Fire",
    author: "Jack London",
    genre: "adventure",
    themes: ["courage", "discovery", "justice"],
    wordCount: 1800,
    originalText: `Day had broken cold and gray when the man turned aside from the main Yukon trail. He walked alone through the spruce timber, and with him trotted a large dog, a native husky.

The man knew it was cold, though he didn't know exactly how cold. Fifty degrees below zero meant eighty-odd degrees of frost. That did not register to him as cold — he was a newcomer to the Yukon, and this was his first winter.

He built a fire. He ate his lunch. The dog sat close, knowing instinctively that this was no time for traveling. But the man pushed on.

He broke through the ice over a spring and wet himself to the knees. He stopped and built a fire, but built it under a spruce tree. The heat of the fire melted the snow in the boughs above. It fell and put out the fire.

He tried again. His fingers were numb. He could barely grip the matches. He managed to light a clump, but could not separate them, and burned his hands. The fire caught and he put out his hands to warm them — too quickly. He put his hands out once more. The flame went out.

He ran. He thought he could run to camp, get warm, come back. But his legs buckled. He fell in the snow.

The dog watched, waiting. It sensed something was wrong. When the man lay still, it crept close and sniffed and then turned toward the trail, toward camp and fire, toward the other food-providers and fire-providers.`,
  },
  {
    title: "Ali Baba and the Forty Thieves",
    author: "One Thousand and One Nights",
    genre: "historical",
    themes: ["courage", "justice", "discovery"],
    wordCount: 1700,
    originalText: `In a town in Persia there lived two brothers, Cassim and Ali Baba. Cassim married a rich wife and became wealthy. Ali Baba was poor and cut wood in the forest to sell in the town.

One day Ali Baba saw forty armed horsemen ride into the forest. He climbed a tree. Their captain stood before a great rock and said: "Open, Sesame!" A door in the rock opened. They all entered and the door closed.

When they rode away, Ali Baba climbed down and said, "Open, Sesame!" The door opened. Inside was a cave filled with silk, gold and silver coins, and bales of merchandise. Ali Baba took as many bags of gold as his three donkeys could carry and went home.

When his brother Cassim found out, he demanded the secret. He went with ten mules loaded with chests, said "Open, Sesame!" and loaded himself with treasure. But he forgot the word and could not get out. The robbers returned and found him and killed him.

Ali Baba came and found his brother and gave him a proper burial with the help of a clever slave girl, Morgiana. When the captain sent his men to find where the treasure had gone, Morgiana foiled them every time.

The captain disguised himself as an oil merchant and came to Ali Baba's house with jars — thirty-seven of them filled with robbers. That night Morgiana went to get oil and discovered the men. She boiled oil and poured it into each jar, killing them all.

When the captain struck at Ali Baba's son at dinner, it was Morgiana who killed him with a dagger. Ali Baba gave his son in marriage to Morgiana in recognition of her wisdom and courage, and they all lived well for the rest of their days.`,
  },
  {
    title: "The Most Dangerous Game",
    author: "Richard Connell",
    genre: "adventure",
    themes: ["courage", "justice", "discovery"],
    wordCount: 2000,
    originalText: `"Off there to the right — somewhere — is a large island," said Whitney. "It's rather a mystery — sailors have a curious dread of the place. They call it Ship-Trap Island."

Rainsford fell overboard in the night and swam to the island. He found an enormous château, and its owner — General Zaroff, an aristocratic Cossack who had hunted every creature on earth and grown bored.

"I needed a new animal to hunt," the General said over dinner. He smiled. "I found one. So I bought this island, built this house, and here I do my hunting. The most dangerous game."

Rainsford understood at last. The General hunted men.

"I give each one a supply of food and an excellent hunting knife. He is to have a three-hour start. If my quarry eludes me for three whole days, he wins. No one has won."

Rainsford was given until dawn the next day. He slept and then ran.

He made trails to confuse the General. He built a Malay mancatcher — a log trap that struck Zaroff's shoulder. He dug a tiger pit. He tied a knife to a sapling as a springboard trap.

On the third night he reached the sea cliff. Zaroff stood before him.

"I congratulate you," said the General. "You have won the game."

But Rainsford knew the game was not yet over. He leapt from the cliff.

When the General entered his bedroom he found a man there waiting for him.

"I am still a beast at bay," said Rainsford. "Get ready, General."

He had never slept in a better bed.`,
  },
  {
    title: "The Secret Garden (Opening)",
    author: "Frances Hodgson Burnett",
    genre: "historical",
    themes: ["friendship", "discovery", "courage"],
    wordCount: 1600,
    originalText: `When Mary Lennox was sent to Misselthwaite Manor to live with her uncle, everybody said she was the most disagreeable-looking child ever seen. Her face was little and thin and her hair was limp and mousy. Her expression was sour and cross.

She had been born in India and had always been ill. When the cholera came and her parents and servants died, she was found in an empty bungalow, having been forgotten entirely in the confusion. She was nine years old and utterly alone.

At Misselthwaite Manor on the Yorkshire moors the wind howled at night and the rooms were silent and strange. Mary explored. One day she found a door in a garden wall — and a key in the soil nearby.

The garden had been locked for ten years, since the master's wife had fallen from a branch and died. No one had entered it since.

Inside, the rose trees grew wild and the beds were tangled and overgrown, but they were alive. Mary began to dig. She found a robin who had befriended her. She found Dickon, a boy from the village who could tame animals and coax things to grow.

And she heard a sound one night — a child crying in the manor. She followed it to a hidden room where a boy named Colin lay in bed, convinced he was an invalid destined to die.

"I am always ill," said Colin.

"You're not," said Mary. "And I know something that will make you well."

She told him about the garden. And together they began their secret work of growing — the garden, and themselves.`,
  },
]

async function main() {
  console.log('Seeding source stories...')

  for (const story of stories) {
    await prisma.sourceStory.upsert({
      where: { id: story.title.toLowerCase().replace(/\s+/g, '-').slice(0, 25) },
      update: story,
      create: {
        id: story.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25),
        ...story,
      },
    })
  }

  console.log(`Seeded ${stories.length} stories.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
