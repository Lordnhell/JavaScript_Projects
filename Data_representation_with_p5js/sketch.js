
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;
var c;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  c = createCanvas(1024, 680);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
    gallery.addVisual(new TechDiversityRace());
    gallery.addVisual(new TechDiversityGender());
    gallery.addVisual(new PayGapByJob2017());
    gallery.addVisual(new PayGapTimeSeries());
    gallery.addVisual(new ClimateChange());
    gallery.addVisual(new shareTTWO());
    gallery.addVisual(new NutrientsTimeSeries());
    gallery.addVisual(new UKFoodAttitudes());
          
}

function draw() {
  background(255);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
