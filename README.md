# React Masonry [![Build Status](https://travis-ci.org/nicholasadamou/react-masonry.svg?branch=master)](https://travis-ci.org/nicholasadamou/react-masonry)

_Have you ever needed to quickly spin up a simple image gallery with masonry tiling in React? You've come to the right place!_

## Getting Started

React Masonry is a simple react component that lets you add a gallery of images or other components in the form of a masonry system to your app. It's super light-weight and requires no external dependencies!

## Installation

You can download the package using `npm` with:

`npm install @nicholasadamou/react-masonry --save`

## Usage (Simple)

To use, simply import the component and specify an array of images and number of columns:

```
import Masonry from '@nicholasadamou/react-masonry';

<Masonry
    images={[
        'https://media.giphy.com/media/8Ry7iAVwKBQpG/giphy.gif',
        'https://media.giphy.com/media/KI9oNS4JBemyI/giphy.gif'
	]}
    columns={3}
/>
```

## Usage (Advanced)

You can also pass in an array of components, `width`, `height`, `scroll` and `animate` like this:

```
import Masonry from '@nicholasadamou/react-masonry';

<Masonry
    columns={3}
    width={"600px"}
    height={"400px"}
    animate={true}
    scrollable={true}
    className="my-class"
>
    {images}
<Masonry>
```

## License

© Nicholas Adamou.

It is free software, and may be redistributed under the terms specified in the [LICENSE] file.

[license]: LICENSE
