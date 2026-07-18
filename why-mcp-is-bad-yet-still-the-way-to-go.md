# Why MCP is bad yet still the way to go

Created: September 22, 2025 9:20 PM
Tags: AI, MCP, Published

# Something seemed weird with AI lately, but I couldn’t tell what

I have snippets of notes that I took, here and there, where I jotted things down because something didn’t make sense to me about them. Over the last few weeks, I’ve noticed more and more things that fit this pattern.

I’ll jump right into the examples.

## Something’s up with AI

> I think one thing that needs to be solved is the AI needs to always build it to be tied to the “real” inputs. Somehow, it should always be building *the thing to display the thing,* rather than the thing itself.
> 

I thought I had a great insight, there, but really, it just shows present-me that I was questioning something I didn’t understand yet. I knew something needed to be fixed with AI agents. But what is that “thing to display the thing” as opposed to the “thing itself”?

## AI on top of the database?

Another thought that I jotted down:

> Wonder if we’ll go back to the database. AI can generate all the forms for it.
> 

I was thinking of things like phpMyAdmin and TablePlus. For most of the databases I’ve worked with, they come with ready-made user interfaces. You could almost make an app entirely by making a database, if you’re engineer-minded enough to look past the clunky visuals.

But we’ve seen AI write our code for us, for years now. Why couldn’t we slot AI in there, between the database and the admin panels? This one seemed like a great opportunity for AI when I wrote it, and indeed still does. Even more so, because databases seem so *useful* to me, in so many ways: they’re almost like the next step from a spreadsheet, and as powerful.

## The Arc browser showed me there’s place for building a ‘viewer’ on top of websites too

About a month ago, I started trying the Arc browser, by The Browser Company of New York.

That’s another story by itself!

But something about Arc popped out at me: Arc has a function to change a website’s visuals for you on the fly. You change the font, the theme colors - it can even provide dark mode on web apps that don’t support it!

This seemed to me like another example of ‘tiny software’, where AI could possibly build something like that. Maybe it can build a simple ‘rose-tinted glasses’ you can use to look at websites.

Follow that idea down the road a bit, and eventually websites are in the same position the database is now. Websites will be more about the data, and the user’s custom AI-built software will handle the visuals.

## Micro micro-services?

Something has seemed to be trending toward smaller apps. In a meeting at work, we mentioned in passing how we all may eventually have our own “calculator” and “todo” apps built for us by AI.

I’ve had more than one niche app built for me using HTML. For example, an app to take my stopwatch times racing around a track in BeamNG, and graph them for me to draw insights.

But perhaps we’ll all build apps that are hyper-personalized and hyper-small-scope. Another potential in this area is, maybe we’ll need to use AI to connect my app to yours someday. Or even between a few of my own.

This was interesting to me, because I had been thinking of AI as heading toward building *huge* things, *sprawling* codebases, not small things. I thought of AI more as building centralized software, not powering tons of creators to make tiny software.

## But what if it turns out even more bottom-up?

We could always write AI into each different input field instead: it’s pretty trivial, as a web developer at this point in the AI era, to do this.

I’ve noticed lately, with the AI chat-bot apps, their chat field tends to take both keyboard input and microphone input - and Google GBoard on android has gotten pretty good, itself, at microphone input. GBoard can also do handwriting input - including cursive writing input! - at least on Chromebooks.

What’s to stop developers from putting mics on all their textfields? Even for number fields, address fields…

I already use the mic on GBoard quite often. Why not everywhere? 

> How does mic *really* tie into AI? Not like NLP AI but like the hyped AI.
> 

>> A-MEM had given me the illustration beforehand that Kent C Dodds used.

>> I had learned about MCP from somewhere beforehand too.

# The disillusioning

The turning point in my journey probably came when I noticed an article from my TLDR email newsletter, on The New Stack: *MCP-UI Aims to Replace ‘Old World’ Websites With AI Agent UIs*. Something about it stood out to me. Perhaps it was that it hearkened back to my ideas from before, that AI might build on top of websites. I felt validated - of course AIs will make UI on top of websites!

But the article was about more than just ‘AI’ by itself: it mentioned ‘MCP’ (Model Context Protocol, Anthropic’s answer to how to let Claude use tools) too, which I was already familiar with by the time. I thought.

## Mr. Dodds is excited about MCP; why am I not?

As I read through the article, there didn’t seem much of substance in it, except that perhaps Copilot will be able to show me buttons soon. Still, it mentioned a presentation by Kent C. Dodds about MCP that touched on MCP-UI. I saved that presentation to watch later.

When I watched it later, he certainly seemed excited about it; but I couldn’t find much about it that was exciting. He spoke a lot about how we could write code for our AI agents to run. He showed a diagram where AIs were separated from reality by an MCP ‘bridge’.

Don’t get me wrong; I have been thinking along the same lines as he was. AI agents need to be able to *do* things. That’s the obvious next step they need in order to become more useful. I’d been watching the MCP space for a while before this, for that reason. I’m excited alongside him. I’m looking for how to give safe but effective access to AI agents so they can make some of these low-effort, low-value decisions that sap all my brain-energy.

But when I watched Mr. Dodds’ video, I came away from it strangely disappointed. Something about it had killed the excitement, and I wasn’t sure what.

## What’s wrong with MCP?

As I thought about it, some other things that paint MCP in a bad light came to mind. For one, I remember the AI of last year or just a few months ago, with demonstrations - that I got to do myself - where the AI learned how to research websites on its own; where the AI learned how to ask me to log in to gain access to my paywalled apps; there was Chatjippity’s ‘Operator’, that can ‘interact with the buttons, menus, and text fields people see on a screen.’. This was from January 2025!

I started to have a question in my mind, that I couldn’t answer. Fundamentally, it was: wait, why do we need MCP again?

Why did we start seeing AI chatbots get integrations to specific websites, instead of just continuing how ‘Operator’ did things? I saw Claude get toggles for “Gmail” and “Google Calendar”. Chatjippity got his own tools, like ‘Code’ and an integration to Google Drive to upload files.

I realized I must have had a fundamental misunderstanding, because I started wondering why any of those integrations were needed. Why not have the AI simply ‘Operate’ its way into any of those websites?

## Well, what even *is* MCP?

The latest ground-level question I had, toward figuring out what MCP was, had to do with where its ‘code’ even runs. When I looked at Kent C Dodds’ diagram, my conception of what the ‘MCP server’ was executing, in terms of computer code, was a black box.

I knew already a major part of what it was for. Allowing a model to run things, like ‘tool use’, or ‘function calling’ before it. But it was unclear, in my mind, how it actually ended up getting to the CLI it was going to trigger, or the browser it was going to run, or whatever. When the model said “call function ‘run command’ with `php artisan serve` ”, what’s actually triggering the command?

My assumption, before going in, was MCP was a little bit like an A-MEM agent, just to give the AI another layer of AI before interacting with the ‘real world’ - its toolbox of functions. That way, my MCP toolbox AI can listen to my main agent AI and understand his intent, then transform that to a function call reliably. So then the main AI doesn’t have to fill up its context with prompts about “This function MUST be called with 2 arguments!”.

The surprise I found, after chatting with Mr. Jippity, was MCP was purely ‘old world’ code - no LLM calls (necessarily) made at all.

Here’s my summary takeaway from my first conversation with Mr. Jippity:

MCP is essentially a single vocabulary to train AIs on, that can be plugged into other structures after training. Instead of training the AI on millions of API examples, we train it on one example, that we then can turn around and write some code to plug our APIs into.

### Why did AI need a ‘single vocabulary’ to train on?

So, why not train AI on the millions of APIs out there? That’s the same thing we’ve done so far, with the entire corpus of the internet, right? Well, I guess that says the reason already, right there. It’s been an enormous cost to get here; it’s not worth doing that again if there’s a cheaper way. And the entire body of internet-accessible API resources is likely an order of magnitude smaller than the corpus AIs have been trained on so far.

The precise misconception I had, if I can tease it out, was that AI could *generalize well*. If you trained it on a million question-and-answer sets about whatever topics you found on the internet, it could learn from that enough to apply it to requests and responses from an API.

And, it *can* - it can figure out, after a bit of conversation, how to send the right data to the server so it will work. But it will need the context of that whole conversation *again*, in order to make that good action next time the same way.

Copying that context and tacking it onto every place where we want the AI to be able to use the API, that *does work* to an extent. He’ll get the right answer pretty often. The problem was the cost of it - it’s disproportionate. He takes longer to process, and it uses more tokens / costs more money.

The key that I was missing, was that AI *is* smart enough to figure out any API out there; but its ability to *ingest* that learning, back into its core thinking, isn’t good enough. For it to do that, we’d have to, again, train it on some corpus of API resources as big as the internet text corpus.

As a side note, whoever solves this problem, the problem of AI being unable to ingest its learnings from boots on the ground, back into its core model; whoever solves that, will unlock the next wave of AI.

## Okay… what is AI again?

The research into MCP eventually led me to question my understanding of what AI was. I thought: isn’t AI better than this?

Here’s how I envisioned it: AI is basically a “what’s the statistically most likely word to follow after *x* preceding words?” function. The function is, in a way, just putting the most commonly-following word on the internet, after whatever came before.

Then, we run it over and over, for each new word. Of course, it takes in more than just the last word. It takes the last 2 words, the last 3, the last sentence, the last paragraph, the last page, etc. However much preceding context you give it.

But, to make it more creative instead of actual-factual, we inject ‘temperature’ into it - some of its words are swapped out for random words, which forces it to not be the same every time, and creatively ‘discover’ different ways to get there.

So, I thought, why can’t we just take the temperature out and it will just always give us the most likely answer the internet bros would’ve provided?

I had another chat with Mr. Jippity about that.

He seemed to think that the way we inject temperature is slightly different. It doesn’t give random words - it makes the function sometimes pick a *less-likely* word. Not a totally random word. So its creativity *and its intelligence* are both directly dependent on the ‘temperature’.

If we zeroed the temperature out, we’d always get the most statistically-likely answer the internet would’ve given us - but that’s not necessarily the *right* answer. It would be consistent; but it would be consistently wrong.

Here’s Jippity himself on it:

> AI is creative by design: instead of checking what is *true*, it predicts what *could* come next. [With low temperature], it always picks the single most likely answer — consistent, but often consistently wrong. [With higher temperature], it samples from the whole range of plausible answers, which makes it look imaginative but also unpredictable. Either way, it’s still guessing from patterns in its training data. That’s why systems like MCP matter: they let AI step outside its own probability game and check against the real world.
> 

## MCP is a crutch for AI

What finally hit me, like a wall of bricks, was: it’s literally *cheaper* for every developer worldwide who builds with AI, to write *more* code for the AI, than it would be to train AI more enough to reliably trigger that code.

The AI (or maybe you could say ‘machine learning’) still isn’t smart enough to hack around in an unfamiliar program!

So MCP is just the next layer on top of the dizzying heights of the tech Tower of Babel, which will be built on top of APIs, which were built on top of HTTP, which was built on top of Arpanet, which was built on top of computers and the telephone network, which was… it goes on and on, and you can even subdivide layers to find more layers. “Her ways are moveable, lest you can know them”.

The tool has literally spawned more work for us. We saw prophets predicting it, but didn’t imagine it would be this way. We said “we’ll be working for AI one day”; well, here it is!

# How MCP is maybe the way to go anyway still

So, the initial article confirmed my thoughts: AI needs to be tied to reality. It needs to build code that processes data to create a chart; not build a chart with each bar manually configured to match the data.

So yes, we need to go backwards a little bit. Toward old-style code again. We found out that, while AI can figure out how a lot of specific apps work - it can't figure it out correctly, reliably, every time we run the prompt.

It's even worse when we run Chain-of-Thought where we prompt it over and over 100s of times. If a statistical guess at the beginning was wrong, it can point the model in the wrong direction. By the end of the ‘thinking process’, the model can be miles off course.

I also saw a side topic recently that’s somewhat related: AI is trained to confidently answer rather than say “I don’t know”, because the training values a wrong answer as better than no answer. The trainers think users will dislike non-answers more than wrong answers. And there might, unfortunately, be some truth to that.

But as far as MCP and its purpose today, I think users are just looking for the reliability MCP is trying to get to, that AI simply can’t do. They know there are facts. Facts are the same every time. So, for that specific fact, they want the AI to be deterministic and end up there every time. They want the creativity for some aspects, but not for places it ties to the real world.

---

The end 

October 15, 2025 5:00 PM Review as a draft all in one piece

February 23, 2026 9:00 AM Review again sometime:

[Notion AI Review](https://app.notion.com/p/Notion-AI-Review-2952172b0a5180148c47f0c4b41d3a5e?pvs=21) 

> The “AI Village” also showed an example that can be tied into this piece: the AIs spend inordinate amounts of time figuring out and re-figuring-out their tools (even though they were MCP). This underscores the importance of MCP. (AI Village, Resources 9/30/25).
> 

August 23, 2026 How stale does MCP sound now?