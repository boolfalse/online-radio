
## Online Radio

This is a simple online radio app built with [React.js](https://react.dev/) and [Node.js](https://nodejs.org/), using following technologies:

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [AudioContext (Web API)](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
- [Express](https://expressjs.com/)
- [socket.io](https://socket.io/)

---



### Installation:

- Clone this repository:

```bash
git clone git@github.com:boolfalse/online-radio.git && cd online-radio
```

- Install frontend and backend dependencies:

```bash
npm install && cd backend && npm install && cd ..
```

- Set up environment variables in ".env" file as described in ".env.example" file.
```dotenv
RADIO_GIST_ID="***"
RADIO_PLAYLIST_FILE="tracks"

VITE_BACKEND_PORT=5000
VITE_SERVER_PORT=5001
VITE_SOCKET_PORT=3000
```

- Run the app:

```bash
# development
npm run dev
# production (TODO: review before production)
npm run build && npm run start
```



### Notes:

- This app uses [GitHub Gist](https://gist.github.com/6b66a0065c70a33f95e0e831cb0c7e9f) as a database for storing tracks ("tracks.json" file).
- This app was built with the help of [OpenAI's Chatbot](https://chat.openai.com/).
- Similar online radio app: [freeCodeCamp Radio](https://coderadio.freecodecamp.org/).
- Testing tracks taken from [freesound.org](https://freesound.org/search/?q=&f=&w=&s=Duration+%28shortest+first%29&advanced=0&g=1&page=9000#sound).
- Frontend UI inspired by: [Daily UI IX: Music Player #009](https://codepen.io/lgkonline/pen/BQdeyZ).
- Background image from: [GIPHY](https://www.pinterest.com/pin/406942516311166244/).



### Author:

- [BoolFalse](https://boolfalse.com)
