function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // console.log('buildMetadata')
  var url = `/metadata/${sample}`;

  // Use d3 to select the panel with id of `#sample-metadata`
  var metadata = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  metadata.html("")

  


  d3.json(url).then(function(data) {

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
 

    // Object.values(data).forEach(value => console.log(value));

    Object.entries(data).forEach(([key, value]) => {
      // Log the key and value
      // console.log(`Key: ${key} and Value ${value}`);
      metadata.append("h5").text(`${key}: ${value}`);
    });
  
  });
}

function buildCharts(sample) {
  console.log('buildCharts')
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  
  d3.json(url).then(function(data){

    const samp_values = data.sample_values;
    const ids = data.otu_ids;
    const labs = data.otu_labels;

    // console.log('Store variables from sample data')
    // console.log(samp_values);
    // console.log(ids);
    // console.log(labs);


    Object.entries(data).forEach(([key, value]) => {
      // Log the key and value
      console.log(`Key: ${key} and Value ${value}`);
    });
 
    // @TODO: Build a Bubble Chart using the sample data

    var data_b = [{
      x: ids,
      y: samp_values,
      mode: 'markers',
      marker: {
        size: samp_values,
        color: ids,
      },
      type: "bubble"
    }];
  
    var layout_b = {
      height: 600,
      width: 800
    };
  
    Plotly.plot("bubble", data_b, layout_b);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    const top_samp_values = samp_values.slice(0, 10);
    console.log('slice from index 0 to102 (take the first two values)', top_samp_values);
    const top_ids = ids.slice(0, 10);
    console.log('slice from index 0 to102 (take the first two values)', top_ids);
    const top_labs = labs.slice(0, 10);
    console.log('slice from index 0 to102 (take the first two values)', top_labs);


    var data = [{
      values: top_samp_values,
      labels: top_ids,
      hovertext: top_labs,
      type: "pie"
    }];
  
    var layout = {
      height: 600,
      width: 800
    };
  
    Plotly.plot("pie", data, layout);
  

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
