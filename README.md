## Project Structure

You must create a folder named `songs` in the root directory of your project. Inside the `songs` folder, create subfolders for each music type, such as `pop`, `hiphop`, `lok`, `folk`, etc. You can give any name to these subfolders.

### Example Structure:

/songs
/pop
- image.jpg
- data.json
- music files (.mk4)
/hiphop
- image.jpg
- data.json
- music files (.mk4)
/lok
- image.jpg
- data.json
- music files (.mk4)
/folk
- image.jpg
- data.json
- music files (.mk4)


### MUSIC File Type

Each music file should be of extension `.mk4` for the given code, if you want other extension to work then you have to change the `.mk4` filter by your desired extension in `script.js` file.


### JSON File Content

Inside each music type folder, include a `.jpg` image file and a `.json` file named `data.json`. The `data.json` file should contain a JSON object with the following structure:

```json
{
  "title": "Beat",
  "description": "Groovy rhythms for dance"
}

