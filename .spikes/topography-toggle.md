# Typography toggle

`2026-07-20 11:21 PM`​

The idea was on a pocket card too.

Swipe to turn into a table of contents but with an animation showing how it folds into it.

The progress the settle animation starts with seems like it's too far back. But maybe that's not it either. When collapsing, it's moving down from above. When expanding, it's moving up from below. I wonder if it's the setting it back from being fixed? Maybe it's getting set back to non-fixed but then it's also trying to animate to the non-fixed position, thinking that it's still fixed. Maybe it needs to wait to be set back to non-fixed till after the animation finishes.

## Spike is proven

This UX affordance is definitely worth it. 

I also want to make it swipe from left to right for both maybe.

And a complete rewrite might not be so bad.

## Not so bad to figure out the code

It wasn't so bad to start figuring it out, like I thought it would be. Then I finally started to get a better understanding of what copilot was talking about, too.
