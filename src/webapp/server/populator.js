const axios = require('axios');

axios.get('https://overpass-api.de/api/interpreter', {
    params: {
        data: `
            [out:json];
            area[name="Trento"]->.searchArea;
            (
              way["highway"](area.searchArea);
              node["place"="square"](area.searchArea);
            );
            out body;
            >;
            out skel qt;
        `,
    },
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
