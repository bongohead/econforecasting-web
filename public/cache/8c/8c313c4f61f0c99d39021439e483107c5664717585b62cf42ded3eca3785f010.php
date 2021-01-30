<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* error.html */
class __TwigTemplate_d3729907d1f93a06757397bc5fd23401753f08c629c5677c2430d691752d8b5e extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'staticlinks' => [$this, 'block_staticlinks'],
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "base.html";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $this->parent = $this->loadTemplate("base.html", "error.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 3
        echo "<script src=\"//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js\"></script>
<style>
main {
\tbackground-color: black !important
}
</style>
";
    }

    // line 12
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 13
        echo "<svg width=\"100%\" height=\"900\" viewBox=\"0 0 1200 900\">
  <!--
  <text x=\"200\" y=\"100\" dominant-baseline=\"middle\" fill=\"white\" text-anchor=\"middle\" font-size=\"24\" font-family=\"sans serif\">
    The Center for Macroeconomic Forecasting & Insights
  </text>
  <text x=\"200\" y=\"140\" dominant-baseline=\"middle\" fill=\"white\" text-anchor=\"middle\" font-size=\"30\" font-family=\"sans serif\">
    is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.
  </text>
-->
 </svg>

<script>
// Map configuration
var width  = 1200;
var height = 900;
var rScale = d3.scale.sqrt();
var peoplePerPixel = 30000;

// Configuration for the spinning effect
var time = Date.now();
var rotate = [0, 0];
var velocity = [.0125, -0];

// set projection type and paremetes
var projection = d3.geo.orthographic()
   .scale(300)
   .translate([500, 500])
   .clipAngle(90);

// create path variable, empty svg element and group container
var path = d3.geo.path()
   .projection(projection);
var svg = d3.select(\"svg\");
var g = svg.append(\"g\");

// drawing dark grey spehere as landmass
g.append(\"path\")
   .datum({type: \"Sphere\"})
   .attr(\"class\", \"sphere\")
   .attr(\"d\", path)
   .attr(\"fill\", \"#0D0D0D\");

g.append('foreignObject')
.append('p')


g.append('text')
  .text('This page is under construction')
  .attr('x', 50)
  .attr('y', 100)
  .attr('fill', 'white')
  .attr('font-size', '2.5rem');
  
  g.append('text')
  .text('CMEFI is a non-partisan think tank working to democratize macroeconomic ')
  .attr('x', 50)
  .attr('y', 140)
  .attr('fill', 'white')
  .attr('font-size', '1.5rem');
  
  g.append('text')
  .text('knowledge by making the necessary tools, data, and insights  ')
  .attr('x', 50)
  .attr('y', 170)
  .attr('fill', 'white')
  .attr('font-size', '1.5rem');

  g.append('text')
  .text('more available for all.  ')
  .attr('x', 50)
  .attr('y', 200)
  .attr('fill', 'white')
  .attr('font-size', '1.5rem');

  
  
// loading city locations from geoJSON
d3.json(\"https://econforecasting.com/static/geonames_cities_500k.json\", function(error, data) {

         // Handle errors getting and parsing the data
         if (error) { return error; }

         // setting the circle size (not radius!) according to the number of inhabitants per city
         population_array = [];
         for (i = 0; i < data.features.length; i++) {
            population_array.push(data.features[i].properties.population);
         }
         const max_population = population_array.sort(d3.descending)[0]
         const rMin = 0;
         const rMax = Math.sqrt(max_population / (peoplePerPixel * Math.PI));
         rScale.domain([0, max_population]);
         rScale.range([rMin, rMax]);

         path.pointRadius(function(d) {
            return d.properties ? rScale(d.properties.population) : 1;

         });

         // Drawing transparent circle markers for cities
         g.selectAll(\"path.cities\").data(data.features)
            .enter().append(\"path\")
            .attr(\"class\", \"cities\")
            .attr(\"d\", path)
            .attr(\"fill\", \"#ffbb73\")
            .attr(\"fill-opacity\", 0.3);

         // start spinning!
         spinning_globe();
});

function spinning_globe(){
   d3.timer(function() {

      // get current time
      var dt = Date.now() - time;

      // get the new position from modified projection function
      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

      // update cities position = redraw
      svg.selectAll(\"path.cities\").attr(\"d\", path);
   });

}


</script>


";
    }

    public function getTemplateName()
    {
        return "error.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  65 => 13,  61 => 12,  51 => 3,  47 => 2,  36 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}
{% block staticlinks %}
<script src=\"//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js\"></script>
<style>
main {
\tbackground-color: black !important
}
</style>
{% endblock %}


{% block content %}
<svg width=\"100%\" height=\"900\" viewBox=\"0 0 1200 900\">
  <!--
  <text x=\"200\" y=\"100\" dominant-baseline=\"middle\" fill=\"white\" text-anchor=\"middle\" font-size=\"24\" font-family=\"sans serif\">
    The Center for Macroeconomic Forecasting & Insights
  </text>
  <text x=\"200\" y=\"140\" dominant-baseline=\"middle\" fill=\"white\" text-anchor=\"middle\" font-size=\"30\" font-family=\"sans serif\">
    is a non-partisan think tank working to democratize macroeconomic knowledge by making the necessary tools, data, and insights more available for all.
  </text>
-->
 </svg>

<script>
// Map configuration
var width  = 1200;
var height = 900;
var rScale = d3.scale.sqrt();
var peoplePerPixel = 30000;

// Configuration for the spinning effect
var time = Date.now();
var rotate = [0, 0];
var velocity = [.0125, -0];

// set projection type and paremetes
var projection = d3.geo.orthographic()
   .scale(300)
   .translate([500, 500])
   .clipAngle(90);

// create path variable, empty svg element and group container
var path = d3.geo.path()
   .projection(projection);
var svg = d3.select(\"svg\");
var g = svg.append(\"g\");

// drawing dark grey spehere as landmass
g.append(\"path\")
   .datum({type: \"Sphere\"})
   .attr(\"class\", \"sphere\")
   .attr(\"d\", path)
   .attr(\"fill\", \"#0D0D0D\");

g.append('foreignObject')
.append('p')


g.append('text')
  .text('This page is under construction')
  .attr('x', 50)
  .attr('y', 100)
  .attr('fill', 'white')
  .attr('font-size', '2.5rem');
  
  g.append('text')
  .text('CMEFI is a non-partisan think tank working to democratize macroeconomic ')
  .attr('x', 50)
  .attr('y', 140)
  .attr('fill', 'white')
  .attr('font-size', '1.5rem');
  
  g.append('text')
  .text('knowledge by making the necessary tools, data, and insights  ')
  .attr('x', 50)
  .attr('y', 170)
  .attr('fill', 'white')
  .attr('font-size', '1.5rem');

  g.append('text')
  .text('more available for all.  ')
  .attr('x', 50)
  .attr('y', 200)
  .attr('fill', 'white')
  .attr('font-size', '1.5rem');

  
  
// loading city locations from geoJSON
d3.json(\"https://econforecasting.com/static/geonames_cities_500k.json\", function(error, data) {

         // Handle errors getting and parsing the data
         if (error) { return error; }

         // setting the circle size (not radius!) according to the number of inhabitants per city
         population_array = [];
         for (i = 0; i < data.features.length; i++) {
            population_array.push(data.features[i].properties.population);
         }
         const max_population = population_array.sort(d3.descending)[0]
         const rMin = 0;
         const rMax = Math.sqrt(max_population / (peoplePerPixel * Math.PI));
         rScale.domain([0, max_population]);
         rScale.range([rMin, rMax]);

         path.pointRadius(function(d) {
            return d.properties ? rScale(d.properties.population) : 1;

         });

         // Drawing transparent circle markers for cities
         g.selectAll(\"path.cities\").data(data.features)
            .enter().append(\"path\")
            .attr(\"class\", \"cities\")
            .attr(\"d\", path)
            .attr(\"fill\", \"#ffbb73\")
            .attr(\"fill-opacity\", 0.3);

         // start spinning!
         spinning_globe();
});

function spinning_globe(){
   d3.timer(function() {

      // get current time
      var dt = Date.now() - time;

      // get the new position from modified projection function
      projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

      // update cities position = redraw
      svg.selectAll(\"path.cities\").attr(\"d\", path);
   });

}


</script>


{% endblock %}", "error.html", "/var/www/econforecasting.com/public/templates/error.html");
    }
}
