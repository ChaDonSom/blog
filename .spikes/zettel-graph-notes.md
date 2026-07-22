# Notes from the zettel entity wiki idea

## Things I think I would be interested in

Similarity search with visibility to the number. 

Title, key terms, summary, \_which are embedded together.\_

Tonight, 7/1/26 Wed, could try 'topic' column not being embedded alone; but embedded with key terms, and summary along with topic/title.

Summary A matches title B? B might go under A.

Title A matches summary B? A might go under B.

Title A matches title B? A and B might be siblings (find parent / create parent?)

Many to many self.

2-step HyDE ish thing: propose, find, refine. That should be everywhere. 

Things have to be contextualized and specific to embed, anything that gets embedded.

ColBERT with pooling is interesting.

## Do I just need to restart?

But it really seems like I just need to start a little fresh as per the Gemini chat [https://gemini.google.com/app/d32e7734f7ddaf0d](https://gemini.google.com/app/d32e7734f7ddaf0d)

Find concepts/entities mentioned

Find existing ones and match them/create new ones

  The problem is within this phase. Deduping. How do you consistently decide "Ford 999" is the same entity as "the hulking wooden frame car"?

Write mentions under each concept/entity

Whew, that's difficult. Gemini mentions having UI for uncertain resolutions and merges; and searching by embeddings of more than just the term itself.

ChatGippity has a schema design idea.

Why not just take a vector of each term expanding to sibling tokens, a few times upward? Like

bear

the bear that

hit the bear that was biting

Jerry hit the bear that was biting the doll

But that \_is\_ essentially the ColBERT thing.

Gemini thinks Anthropic's prompt for contextualizing before embedding looks like this: [https://gemini.google.com/app/9580fb0b44820f34](https://gemini.google.com/app/9580fb0b44820f34)

## Scheduling

Useful to put in new atom graph repo for researching this.

I'd like to try putting it in the atom graph repo tomorrow, Sunday, if I feel like it then, otherwise another time in the week.

I put this for tonight because it seems a little bit in line with my latest spike on "trying to take notes with vs code or markdown or wiki-style notes with rudely basic files and tools"

I wonder if it would be easier to do as an extension for vs code.

## Similarity between topics and identification

Seeing if this note is from the same topic as previous notes is a little bit similar and a little bit different from what I was already doing where I have the LLM see if the entities are the same entity as the existing ones or not. 

You might collect the spread of semantically related notes, and then have an LLM judge which topic it belongs to.

There may be some use for explicitly labeling the AI-guessed ideas. This can keep it from going off the deep end without grounding.

What's the difference between a topic and an entity? Well one thing is an entity is what a zettel is about.
