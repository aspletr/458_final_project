let map, scriptPanel = scrollama(), stateLayer, countyLayer, sceneIndex = 0;
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
history.scrollRestoration = "manual";
window.scrollTo(0, 0);
adjustStoryboardlSize();
window.addEventListener("resize", adjustStoryboardlSize);
function adjustStoryboardlSize() {
  const scenes = document.getElementsByClassName("scene");
  const storyboard = document.getElementById("storyboard");
  let sceneH = Math.floor(window.innerHeight * 0.75);
  for (const scene of scenes) {
    scene.style.height = sceneH + "px";
  }
  let storyboardHeight = window.innerHeight;
  let storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;
  storyboard.style.height = storyboardHeight + "px";
  storyboard.style.top = storyboardMarginTop + "px"
  scriptPanel.resize();
}
map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  zoom: 4,
  minZoom: 1,
  maxZoom: 10,
  center: [-98.93, 40.33],
  scrollZoom: false,
  boxZoom: false,
  doubleClickZoom: false
});
async function geojsonFetch() {
  let response, state, county;
  response = await fetch("assets/state_data.geojson");
  state = await response.json();
  response = await fetch("assets/us_covid_2020_rates.json");
  county = await response.json();
  map.on('load', () => {
    map.addSource('county-src', {
      type: 'geojson',
      data: county
    });
    map.addSource('state-src', {
      type: 'geojson',
      data: state
    });
    stateLayer = {
      'id': 'state-polygons',
      'type': 'fill',
      'source': 'state-src',
      'minzoom': 5,
      'paint': {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5
      }
    };
    countyLayer = {
      'id': 'county-points',
      'type': 'fill',
      'source': 'county-src',
      'minzoom': 3,
      'paint': {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'cases'],
          2500, '#fc9272',
          5000, '#fb6a4a',
          10000, '#ef3b2c',
          20000, '#cb181d',
          50000, '#a50f15',
          60000, '#67000d'
        ],
        'fill-opacity': 0.5
      }
    };
    scriptPanel
      .setup({
        step: ".scene",
        offset: 0.33,
        debug: false
      })
      .onStepEnter(handleSceneEnter)
      .onStepExit(handleSceneExit)
    function handleSceneEnter(response) {
      let index = response.index;
      sceneIndex = response.index;
      if (index === 0) {
        map.flyTo({
          center: [-123.93, 47.33],
          zoom: 6,
          pitch: 0,
          speed: 1.2
        });
        if (typeof (map.getSource('state-src')) == 'undefined') {
          map.addSource('state-src', {
            type: 'geojson',
            data: state
          });
        } else {
          map.getSource('state-src').setData(state);
        }
        if (!map.getLayer("state-polygons")) {
          map.addLayer(stateLayer);
        }
        document.getElementById("cover").style.visibility = "hidden";
        map.setFilter('state-polygons', ['==', 'name', 'Washington']);
      } else if (index === 1 || index === 5) {
        if (index === 1) {
          map.setFilter('state-polygons', ['==', 'name', 'New York']);
        }
        map.flyTo({
          center: [-78.93, 43.33],
          zoom: 6,
          pitch: 0,
          speed: 1.5
        });
        if (index === 1) {
          map.setFilter('state-polygons', ['==', 'name', 'New York']);
        }
      } else if (index === 2 || index === 6) {
        if (index === 2) {
          map.setFilter('state-polygons', ['==', 'name', 'Georgia']);
        }
        map.flyTo({
          center: [-84.93, 32.33],
          zoom: 6,
          pitch: 0,
          speed: 0.8
        });
      } else if (index === 3 || index === 7) {
        if (index === 3) {
          map.setFilter('state-polygons', ['==', 'name', 'Florida']);
        }
        map.flyTo({
          center: [-83.93, 27.33],
          zoom: 6,
          pitch: 0,
          speed: 0.8
        });
      } else if (index === 4) {
        map.flyTo({
          center: [-123.93, 47.33],
          zoom: 6,
          pitch: 0,
          speed: 0.8
        });
        if (typeof (map.getSource('county-src')) == 'undefined') {
          map.addSource('county-src', {
            type: 'geojson',
            data: county
          });
        } else {
          map.getSource('county-src').setData(county);
        }
        if (!map.getLayer("county-points")) {
          map.addLayer(countyLayer);
        }
      } else if (index === 8) {
        map.flyTo({
          center: [-98.93, 40.33],
          zoom: 4,
          pitch: 0,
          speed: 0.8
        });
      }
    }
    function handleSceneExit(response) {
      let index = response.index;
      if (index === 0) {
        if (response.direction == 'down') {
          document.getElementById("cover").style.visibility = "hidden";
          map.setFilter('state-polygons', ['==', 'name', 'Washington']);
        } else {
          document.getElementById("cover").style.visibility = "visible";
        }
      } else if (index === 1) {
        if (response.direction == 'up') {
          map.setFilter('state-polygons', ['==', 'name', 'Washington']);
        } else {
          map.setFilter('state-polygons', ['==', 'name', 'New York']);
        }
      } else if (index === 2) {
        if (response.direction == 'up') {
          map.setFilter('state-polygons', ['==', 'name', 'New York']);
        } else {
          map.setFilter('state-polygons', ['==', 'name', 'Georgia']);
        }
      } else if (index === 3) {
        if (response.direction == 'down') {
          if (map.getLayer("state-polygons")) {
            map.removeLayer('state-polygons');
          }
        } else {
          map.setFilter('state-polygons', ['==', 'name', 'Georgia']);
        }
      } else if (index === 4) {
        if (response.direction == 'up') {
          if (map.getLayer("county-points")) {
            map.removeLayer('county-points');
          }
          if (typeof (map.getSource('state-src')) == 'undefined') {
            map.addSource('state-src', {
              type: 'geojson',
              data: state
            });
          } else {
            map.getSource('state-src').setData(state);
          }
          if (!map.getLayer("state-polygons")) {
            map.addLayer(stateLayer);
          }
          map.setFilter('state-polygons', ['==', 'name', 'Florida']);
        }
      } else if (index === 8) {
        if (response.direction == 'up') {
          if (typeof (map.getSource('county-src')) == 'undefined') {
            map.addSource('county-src', {
              type: 'geojson',
              data: county
            });
          } else {
            map.getSource('county-src').setData(county);
          }
          if (!map.getLayer("county-points")) {
            map.addLayer(countyLayer);
          }
        }
      }
    }
  });
  map.on('mousemove', ({ point }) => {
    let countyFeatures = map.queryRenderedFeatures(point);
    countyFeatures = countyFeatures.filter(feature => feature.layer.id === 'county-points');
    const scene4 = document.querySelector('[data-scene="4"]');
    const scene5 = document.querySelector('[data-scene="5"]');
    const scene6 = document.querySelector('[data-scene="6"]');
    const scene7 = document.querySelector('[data-scene="7"]');
    if (countyFeatures.length > 0) {
      const county = countyFeatures[0].properties.county;
      const cases = countyFeatures[0].properties.cases;
      if (sceneIndex === 4) {
        const hoverInfo = scene4.querySelector('h3');
        hoverInfo.textContent = `${county} County: Total Cases ${cases}`;
      }
      if (sceneIndex === 5) {
        const hoverInfo = scene5.querySelector('h3');
        hoverInfo.textContent = `${county} County: Total Cases ${cases}`;
      }
      if (sceneIndex === 6) {
        const hoverInfo = scene6.querySelector('h3');
        hoverInfo.textContent = `${county} County: Total Cases ${cases}`;
      }
      if (sceneIndex === 7) {
        const hoverInfo = scene7.querySelector('h3');
        hoverInfo.textContent = `${county} County: Total Cases ${cases}`;
      }
    } else {
      const hoverInfo = document.querySelectorAll('h3');
      hoverInfo.forEach(info => {
        info.textContent = "Hover over a County for more Info!";
      });
    }
  });
};
geojsonFetch();