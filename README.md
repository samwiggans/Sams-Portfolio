# Sam's Top 5s

A personal website for your definitive top 5 of anything — TV shows, movies, games,
albums, whatever you add next.

## Open it

Double-click **index.html**. That's it — no installing anything.

## Add your own lists

Click **Edit lists** in the top right. You can:

- pick a category from the dropdown, or hit **+ New** to make one
- give it a name and an emoji
- fill in the five slots: title, a meta line (year / platform / director), a small tag,
  and a note on why it made the cut
- add a picture per entry — either **Upload image** (pick a file, it gets resized and
  stored automatically) or paste a path/address into the box
- hit **Save changes**

Blank slots aren't shown, so a top 3 works fine while you make your mind up.
Entries with no picture get a generated poster, so nothing ever looks broken.

## Where your lists are stored

In your browser, on this computer. Two things worth knowing:

- **Export data** (bottom of the page) saves a `.json` backup — worth doing occasionally,
  and it's how you move your lists to another computer or browser (**Import data** there).
- **Reset to defaults** wipes your edits and restores the starter lists.

If you'd rather keep lists in a file that travels with the site, edit `js/data.js`
directly — the format is documented at the top of that file. Those are the defaults
the site falls back to.

## Images

Drop image files into the `images` folder and reference them as `images/name.jpg`,
or just use the Upload button and forget about the folder. Poster-shaped (2:3) images
look best, but anything gets cropped to fit.

## Files

```
index.html      the page
css/styles.css  all the styling
js/data.js      your starter lists — edit by hand if you like
js/app.js       rendering + the editor
images/         your pictures
serve.ps1       optional: runs the site on http://localhost:8765
```
