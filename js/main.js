// Main JavaScript file

// 1. Declare the maps, script panels, and different thematic layers.
let map, scriptPanel = scrollama(), countiesLayer;

// 2. Initialize the layout.
// ... 

// 3. Define Generic window resize listener event
function adjustStoryboardlSize() {
  // ...
}

// 4. Initialize the mapbox
// ...

// 5. Define the asynchronous function to load geojson data and then performs the dependent actions.
async function geojsonFetch() {
  // ...

  // 7. Trigger operations inside of the ()=> {} funciton while loading the map.
  map.on('load', () => {
    // 8. Add map source and declare layers.
    // ...

    // 9. Initialize the script panel
    scriptPanel
      .setup({
        step: ".scene", // all the scenes.
        offset: 0.33, // the location of the enter and exit trigger
        debug: false // toggler on or off the debug mode.
      })
      .onStepEnter(handleSceneEnter)
      .onStepExit(handleSceneExit);

    // 10. This function performs when a scene enters the storyboard
    function handleSceneEnter(response) {
      var index = response.index; // Capture the id of the current scene.

      if (index === 0) {
        // When enter the first scene
        map.flyTo({
          center: [-121.93, 47.33],
          zoom: 8,
          pitch: 0,
          speed: 0.5
        });
        // ...
      } else if (index === 1) {
        // When enter the second scene
        // ...
      }
      // ... Handle other scenes
    }

    // 11. This function performs when a scene exits the storyboard
    function handleSceneExit(response) {
      var index = response.index;
      if (index === 0) {
        // When exit the first scene
        // ...
      } else if (index === 1) {
        // When exit the second scene
        // ...
      }
      // ... Handle other scenes
    }
  });
}

// 5. Call the data loading function.
geojsonFetch();
