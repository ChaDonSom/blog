# Vue component contexts

Created: June 20, 2025 11:07 AM
Tags: Published

I wish I could diagram all the contexts that Vue component code runs in, and then also diagram all other contexts related code runs in. For example, PHP, HTML, CSS, JS, TS, SCSS, Tailwind, etc. I wonder if it will work if I start by listing out the different contexts I can find in one example Vue component.

```html
<script lang="ts">
```

Before this block reaches the browser, it will be run through a compiler to convert the Typescript code inside, to Javascript. Once it reaches the browser, the outer HTML will be parsed first. Then the contents of the `<script>` block - now plain JavaScript - will execute once, typically during the initial component setup. Generally, the JS that runs here once doesn't do much more than registering things to be run later, usually during this component’s lifecycle - its journey from a twinkle in the code’s eye, to visually appearing on the page, to being removed after it has accomplished its purpose. Each function or variable registered at the beginning generally sits and waits for the browser to trigger it later, depending on what the code tells it to trigger from.

```tsx
export default {}
```

During building, this allows other files to be able to reference this file. It will either combine the file together with any that say to `import` that file, or it will convert the statements to references that will still hold true for the browser, once this gets delivered to the browser. So, at JS runtime in the browser, and usually that's at the first run-through, this means whatever variable declared here can be accessed from JS that came from other files.

```html
<script lang="ts" setup>
```

The `setup` flag (an HTML attribute) tells the compiler to treat everything within this `<script>` tag as contained within the Vue component’s `setup` function. It is only run for that ‘first and once’ time, once the Vue component is ‘mounted’ to the browser’s web page.

```html
<script lang="ts" setup generic="T extends DefaultTask">
```

The `generic` attribute tells the Vite compiler that the component’s props will be typed, per Typescript, with a type called `T`, so it should expect it there. TS is compiled away by the compiler, but it runs in the editor while the developer is writing code. The TS code allows the editor to inspect the code without running it, and gives it some idea what it should look for. If anything’s amiss, it can show helpful warnings like red squiggly lines and hover popup messages.

Yes, Typescript is entirely developer-written and the code is entirely developer-written, so that means Typescript is a self-imposed guardrail. It can be as good or as bad as you make it.

```tsx
import { ref, watch } from 'vue'
```

`import` statements, like the `export` statement, tell the compiler this file will need to know where the other file’s code is, once it gets to the browser. The fact that it’s importing from a generic string, rather than a file path, means the compiler will get these items from third-party code, which is installed in the `node_modules` folder. `npm`, node’s package manager CLI, copies the code from the online repository to the computer, when `npm install` is run. Node is a runtime for Javascript in the OS instead of within a browser; for example, the server, or the developer’s machine.

```tsx
import PillListLayout from '@/js/console/jobs/PillListLayout.vue'
```

The `@` tells the compiler to use the file path stored in its configuration under the `@` name. At runtime, this will reference the JS this file compiled to, which JS will reference the HTML or CSS or anything else it might need. During writing, this means the consuming component can insert the imported one into its HTML template. It can also process the component within the JS/TS, although this is less common a pattern with Vue than it is with React. Looking up some information on it just now, I read that Composition API and other Vue component mix-and-match methods like Scoped Slots, are Vue’s answer to higher-order-components.

```tsx
const $t = use$t()
```

This variable (constant) will remain here (in memory), even after the `setup` function ends, but only within the scope of the setup function. That is, only functions defined within the setup function will be able to access that variable. It is also exposed within the Vue component, to the component’s template. This means that, at the template’s render time (generally at mounting time), it can be accessed like `{{ $t }}`, which will evaluate the value of the variable and cast it to a string to be applied to the HTML at runtime. If `$t` is a function, it may look like `{{ $t('Translation') }}`. The function will be called as part of the render process, with the given string argument. However, this is getting a little deeper into the template context, where we’re still moving through the TS context.

The `use$t()` function, since it is invoked here with `()`, runs immediately as part of the `setup` function’s ‘first time run’ that usually only runs once. Whatever that function does will run at this time. This is slightly before the component mounts.

```tsx
interface Props {
  categoryName: string
  tasks: T[]
  isUnassigned?: boolean
}
```

`interface` is entirely Typescript. As such, it’s only useful for the IDE helpers it provides.

```tsx
const props = withDefaults(defineProps<Props>(), {
  isUnassigned: false,
})
```

`withDefaults` and `defineProps` are compiler macros provided by Vue’s build tooling (like Vite). They’re not real Javascript functions; instead, the compiler recognizes and transforms them at build time. `defineEmits` and `defineModel` also work this way. The compiler will compile them away, to however things work in runtime. In this example, `<Props>` is a reference to the `interface` above, and the `<>` brackets tell the TS compiler that this is a TS part of the function call. Inside the `()` parentheses is JS. From the `withDefaults` call, we see the first JS argument is the result of the `defineProps<Props>()` call, which will have the type compiled away at runtime. The second argument is pure JS, a plain old javascript object (POJO).

```tsx
wheneverChangingFromNull(categoryId, async function updateCategoryIdsOnTasks(newValue) {
```

This is a custom function that sets up a watcher. When the `categoryId` variable gets changed, the browser will run the second argument, `updateCategoryIdsOnTasks`. The context it will run in is slightly unknown, but we know it will be in the browser, with the current Vue component mounted. `categoryId` may have changed, at the very beginning of it, from a user click (which triggers a browser event, which triggers some JS to run), or from a timer previously started, or from a websocket coming in from the server.

```tsx
async function saveForm() {
  await form.save()
}
```

The `async` keyword registers a function (this example will be called when the submit button of a form is pressed) that behaves differently to normal code, with regards to context. Any expression within the function that starts with the `await` keyword, waits for a ‘Promise’ to finish (`form.save()` here would evaluate to a promise), before moving to evaluate the next expression. A Promise can be set up like this:

```tsx
new Promise(function (resolve: () => void, reject: () => void) {
	if (/* Something good happened */) {
		resolve()
	} else /* Something bad happened */ {
		reject()
	}
})
```

When a promise `resolve`s, the code is free to move to the next expression after the `await`ed expression. It is given all the same context, as far as references, but the values of the variables may have changed, if any other contexts had access to them and changed them.

If a promise `reject`s, it’s the same as an Error being thrown. The code will not move on, but instead the context is changed to an error context, and the Error will continue throwing, up the call tree, until one of the callers catches it.

Promises are used extensively (but not exclusively) for API calls. We generally assume things will still be here and mostly intact, by the time the server responds.

```html
<template>
```

This tag marks the beginning of the HTML template for the Vue component. Template code is mostly HTML, with minimal capabilities added by the compiler, for some dynamic behavior.

HTML code is generally a structural outline, written in XML, that uses the browser’s provided elements, to build out a page. The browser provides many elements that can be used, like `<button>`, `<table>`, `<p>` (for paragraph), and `<video>`. See [MDN’s HTML elements reference page](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements) for a complete list.

The HTML code within a Vue component has slightly adjusted syntax, as we’ll see.

```html
  <PillListLayout
```

Since this opening tag is unclosed, we can still provide attributes to the element it describes, until we give the `>` closing bracket.

In plain HTML, using upper/lowercase to separate words is an anti-pattern. This element would evaluate to `<pilllistlayout>` in plain HTML. However, we use the Vue compiler’s capabilities here, to differentiate what we know is a Vue component, from built-in HTML elements. There is an existing pattern in HTML nowadays, to differentiate custom elements, where it must have at least two words and use kebab-case. You might even see the remnants of this pattern, here and there. It became common to prefix custom elements with a small prefix like `<v-item>`. I’ve since switched to this method since I feel having no prefix, though further from base HTML, introduces less noise into the template code.

```html
<PillListLayout
		...
    @sort-toggle="sortAZToggle"
    ...
>
```

This attribute registers a JS function to be called, whenever a certain browser event is triggered from anywhere within the `<PillListLayout>` component. That child component emits a custom Vue event called `sort-toggle`. The parent listens for it using the `@sort-toggle` directive, and responds by calling the `sortAZToggle` function, with whatever arguments the event brought with it.

```html
<PillListLayout
		...
    v-model:error-string="error"
    ...
>
```

This special directive evaluates to

```html
<PillListLayout
		...
		:error-string="error"
		@update:error-string="error = $event"
    ...
>
```

Which also can be further explicit-ized to

```html
<PillListLayout
		...
		v-bind:error-string="error"
		v-on:update:error-string="error = $event"
    ...
>
```

The directive `v-bind` passes the value of the JS variable given to it, into the HTML template, having been stringified - or however the browser handles element data. The browser has [a specific API](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Use_data_attributes) now for data in element attributes. Vue is able to read the attributes passed to the element, as Vue props.

The [`v-on` directive](https://vuejs.org/guide/essentials/event-handling#listening-to-events) registers a function to be called when the given event (`update:error-string`) fires. Vue knows that `error = $event` is not a function, so it wraps it in a function, to be called when the event fires; it is not run right away, like the code appears. `$event` is a special Vue-template syntax that gives us access to the event’s arguments.

So, in this example, we’re essentially two-way binding the variable, to the component’s prop. If the component’s prop changes, the variable will be changed. If the variable changes from some other place, the component’s prop will be changed.

There are a couple other special things about Javascript written in Vue-component-template-element attributes.

In Vue templates, function expressions are not invoked immediately - even if they appear to be. Instead, Vue wraps them in a listener that runs when the associated event occurs. For example,

```html
<PillListLayout
		...
		@click="giveUserACookie('john')"
		...
>
```

In this case, `giveUserACookie` would be bound with the argument `'john'`, so any calls to it with other arguments added (say, an event, perhaps an event triggered it - like `giveUserACookie(event)`) would look like `giveUserACookie('john', event)`.

Other variables in the template are available in certain times as well, for example, the instance variable of a `for` loop:

```html
<PillListLayout
		...
		v-for="user of users"
		@click="giveUserACookie(user)"
		...
>
```

In this example, the `user` variable from the render-time will be bound to the function, for whenever it’s called later.

```html
<PillListLayout
		...
		ref="mainRef"
		...
>
```

The `ref` attribute points to a variable defined in the `<script>` called `mainRef`. When the HTML element it’s assigned to is mounted, the variable will get assigned the JS object representing it. The referenced variable is typically declared like `const mainRef = ref(null)`  in Javascript, or typed more explicitly in Typescript:

```tsx
const mainRef = ref<HTMLElement | null>(null)
```

- **Side note**
    
    Vue recently added a `useTemplateRef` for this as well (`const mainRef = useTemplateRef(’mainRef’)`), but I haven’t figured it out entirely yet.
    

```html
<PillListLayout
  ...
>
  ...
</PillListLayout>
```

After defining all the things that apply to the element itself, within its opening tag, we close it later on, after defining its children. This is any more HTML/template code that should be considered as ‘inside’ the component. Unfortunately, what counts as ‘inside’ is largely subjective. However, there are two notes I could go over anyway.

There are two ways to make a Vue component have ‘children’. The first is by defining HTML elements within its template code, in the `.vue` file itself:

```html
<template>
  <div>
	  <children /> <!-- a `/>` makes an opening tag work as both
	  opening and closing -->
	</div>
</template>
```

When children are defined this way, they’re closer to the root identity of the Vue component. They also won’t be seen by anyone using the component, while they work with it in their consuming component’s code. The definer component retains greater power over the children as well, since it can apply scoped styles to them, and they’re not practically exposed to parents or descendants.

The other way to allow children for a component gives more power to the parent/consumer component.

```html
<template>
	<div>
		<slot>
		</slot>
		
		<!-- Or: -->
		
		<slot />
	</div>
</template>
```

This basically means any template code placed between this component’s opening and closing tags, will be rendered here. Although one thing to be aware of is, they will be rendered from the parent component’s context.

So, with our `PillListLayout` component, everything between its two tags will be inserted into wherever its `<slot />` tag is, within it.

Slot-providing components can also provide [‘Scoped slots’](https://vuejs.org/guide/components/slots) or named slots, in which case, the template code inserted to them, will go to where that specific slot was defined.

```html
<PillListLayout>
	<template #name-of-slot>
		This will be rendered wherever `name-of-slot` was defined within
		PillListLayout
	</template>
</PillListLayout>
```

Within `PillListLayout`:

```html
<template>
	...
	<slot name="name-of-slot" />
	...
</template>
```

Whatever template code is provided by the parent for that slot, is unknown to the child component who is ‘adopting’ it. Also, the template code retains the parent’s scope:

```html
<script lang="ts" setup>
const users = ref(50)
</script>

<template>
	<PillListLayout>
		<template #slot-name>
			{{ users }} users
		</template>
	</PillListLayout>
</template>
```

The child component doesn’t know about the `users` ref. There is a method to pass data from the child, through that slot, up to the parent. But I’ll leave that for another time. It can be found in the ‘Scoped slots’ link from above, though.

```html
<div class="flex flex-wrap items-center">
```

Here is where Tailwind comes in. Tailwind writes CSS classes that are named very simply and tend to do only one thing. Then, instead of constructing complex CSS classes to apply to HTML elements, we construct the complexity of what the CSS will do, from within the template. This is because, I believe, the identity of the element, and therefore, the purpose of its styling, is tied irrevocably to the HTML. In the past, when I’ve written CSS separately from HTML, the strain of having another whole layer of naming things was too much to maintain.

At any rate, Tailwind will provide CSS classes that mostly just do what they say:

```css
.flex {
	display: flex;
}
```

They can be seen by hovering over them, given you’re in VSCode with the Tailwind extension.

Now, CSS has its own weird and wildly-complex layered world of contexts, which I’d prefer not to get into at this point. I think that the primary thing to remember about CSS is that it stands for Cascading Style Sheets, ‘cascade’ meaning invalid CSS lines will simply be ignored and rolled over, and lines that come after will override lines that come before. ‘Latest wins’, essentially.

CSS is essentially a bespoke system for telling the browser how to visually adjust the HTML structure. As far as I’ve been able to study it, there is no unifying central structure in it, to help learn it with. It’s simply a huge collection of useful utility functions for UI styling. It was developed organically over time.

That said, I suppose there is one starting point - the majority of our Tailwind or CSS that we use will be about either layout - positioning on the page - or elements’ visual attributes like background color, border roundedness, etc.

CSS is applied as it comes in, so Vue usually loads it in parallel with the template and script code. If you were to load it all separately, you’d have a flash of unstyled content (FOUC), where the browser has received and parsed the HTML (it fires off any requests the HTML said it had for CSS, at this point), but the CSS request is still waiting.

# Whew, that’s a lot!

To summarize it, a Vue component is a collection of browser resources that, taken together, make up a specific piece of the browser page. The code found in a Vue file runs and is transported through many different contexts. Each layer of code may even take different paths before reaching its destination and performing its purpose.

Vue represents a philosophy that these three main classes of code, HTML, JS, and CSS, ought to be tightly coupled during development. They should be colocated as closely together as possible.

As of late, its Composition API may represent a movement away from that spirit, toward the idea that Javascript could stand to separate from the ‘view’ layer a little more.