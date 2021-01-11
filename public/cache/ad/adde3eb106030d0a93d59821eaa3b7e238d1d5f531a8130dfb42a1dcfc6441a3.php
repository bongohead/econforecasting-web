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

/* home.html */
class __TwigTemplate_710270983adcc09738b676ae0aa9f631d7546b8f5ecc27a1fc7187d5e4af4f82 extends \Twig\Template
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
            'description' => [$this, 'block_description'],
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
        $this->parent = $this->loadTemplate("base.html", "home.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<!--<script src=\"//code.highcharts.com/stock/highstock.js\"></script>
<script src=\"//code.highcharts.com/modules/heatmap.js\"></script>

<script src=\"//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js\"></script>
<script src=\"//code.highcharts.com/maps/modules/map.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/world-robinson.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/europe.js\"></script>

<script src=\"//code.highcharts.com/stock/indicators/indicators.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/ema.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/bollinger-bands.js\"></script>

<script src=\"static/script-fincontagion.js\"></script>
<script src=\"static/mapGenerator.js\"></script>
<script src=\"static/tsGenerator.js\"></script>
-->
";
    }

    // line 23
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 24
        echo "    <div class=\"overlay\">
    </div>
    
    <section class=\"container\">
        ";
        // line 28
        $this->displayBlock('description', $context, $blocks);
        // line 29
        echo "    </section>
    
    
    <section class=\"container\" id=\"spinnercontainer\" style=\"\">
        <div class=\"row\">
            <div class=\"text-center col-12\"><h4 style=\"text-align:center\" id=\"loadmessage\">Loading data and making graphs...</h4></div>
        </div>
        <div class=\"row\">
            <div class=\"sk-circle\">
                <div class=\"sk-circle1 sk-child\"></div>
                <div class=\"sk-circle2 sk-child\"></div>
                <div class=\"sk-circle3 sk-child\"></div>
                <div class=\"sk-circle4 sk-child\"></div>
                <div class=\"sk-circle5 sk-child\"></div>
                <div class=\"sk-circle6 sk-child\"></div>
                <div class=\"sk-circle7 sk-child\"></div>
                <div class=\"sk-circle8 sk-child\"></div>
                <div class=\"sk-circle9 sk-child\"></div>
                <div class=\"sk-circle10 sk-child\"></div>
                <div class=\"sk-circle11 sk-child\"></div>
                <div class=\"sk-circle12 sk-child\"></div>
            </div>
        </div>
    </section>
    
    <section class=\"container\" style=\"margin-bottom:20px\">
        <form class=\"form-inline\" method=\"post\" action=\"\" id=\"corrselector\">
            <div class = \"form-group\">
                <label for=\"freqtrail\" style=\"font-weight:600\" >Data frequency</label>
                <select class=\"form-control form-control-sm\" id=\"freqtrail\"></select>
                <input type=\"hidden\" id=\"freq\" name=\"freq\"></input>
                <input type=\"hidden\" id=\"trail\" name=\"trail\"></input>
            </div>
            <div class = \"form-group\" style=\"margin-left:10px\">
                <label for=\"corr_type\" style=\"font-weight:600\" >Correlation Type</label>
                <select class=\"form-control form-control-sm\" name=\"corr_type\" id=\"corr_type\"></select>
                <button class=\"btn btn-primary btn-sm\" type=\"submit\" id=\"submitcorrselector\" >Change</button>
            </div>
        </form>
    </section>

    <section class=\"container\" id=\"resultscontainer\">
        <ul class=\"nav nav-tabs\" id=\"myTab\" role=\"tablist\">
            
          <li class=\"nav-item\">
            <a class=\"nav-link active\" data-toggle=\"tab\" href=\"#heatmaptab\" role=\"tab\" aria-selected=\"true\">Correlation Matrix</a>
          </li>

            
          <li class=\"nav-item\">
            <a class=\"nav-link\" data-toggle=\"tab\" href=\"#maptab\" role=\"tab\">Correlation Map</a>
          </li>
          
          <li class=\"nav-item\">
            <a class=\"nav-link\" data-toggle=\"tab\" href=\"#tstab\" role=\"tab\">Historical Correlation Data</a>
          </li>

        </ul>
        
        
        <div class=\"tab-content\" id=\"myTabContent\">
            
          <div class=\"tab-pane fade show active\" id=\"heatmaptab\" role=\"tabpanel\" >
            <div class=\"container\">    
                <div class=\"row\">
                    <div class=\"col-lg-12\">
                        <div id=\"heatmap\"></div>
                    </div>
                </div>
            </div>
          </div>

            
          <div class=\"tab-pane fade\" id=\"maptab\" role=\"tabpanel\" style=\"background:url('static/bg-parchment.png') no-repeat center center fixed;background-size: cover;\">
                <form class=\"form-inline\">
                    <div class = \"form-group\">
                        <label for=\"showLines\" style=\"font-weight:600\" >Draw connections between closely correlated countries?</label>
                        <input type=\"checkbox\" checked=\"checked\" name=\"showLines\" id=\"showLines\">
                    </div>
                </form>
                <form class=\"form-inline\">
                    <div class = \"form-group\">
                        <label for=\"minLines\"  style=\"font-weight:600\"  >Minimum correlation (0 to 1):</label>
                        <input type=\"text\" class=\"form-control form-control-sm\" id=\"minLines\" value=\"0.75\" style=\"max-width:80px\">
                        <button class=\"btn btn-primary btn-sm\" type=\"button\" id=\"submitLines\" >Submit</button>
                        <div id=\"errormessageLines\" class=\"invalid-feedback\">Error Message!</div>
                    </div>
                </form>
                <div class=\"row\">
                    <div class=\"col-lg-12\" id=\"highMap\"></div>
                </div>
                
                <div class=\"row\">
                    <div></div>
                    <div class=\"col-lg-12 float-right\" id=\"highMapEurope\"></div>
                </div>
          </div>
          
          <div class=\"tab-pane fade\" id=\"tstab\" role=\"tabpanel\" style=\"\">
                <form class=\"form-inline\">
                    <div class = \"form-group\">
                        <label for=\"corr_1\" style=\"font-weight:600\" >Get historical correlation for: </label>
                        <select class=\"selectcorr form-control form-control-sm\" id=\"corr_1\">
                        </select>
                        <label for=\"corr_2\" style=\"font-weight:600\" > and </label>
                        <select class=\"selectcorr form-control form-control-sm\" id=\"corr_2\">
                        </select>
                        <button class=\"btn btn-primary btn-sm\" type=\"button\" id=\"submitTS\" >Go</button>
                        <div id=\"errormessageTS\" class=\"invalid-feedback\">Error Message!</div>
                    </div>
                </form>
                
                
                <div class=\"row\">
                    <div class=\"col-lg-12\" id=\"tsChart\"></div>
                </div>
          </div>
          

          
        </div>
    </section>
    
    <section class=\"container\">
    </section>
";
    }

    // line 28
    public function block_description($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    public function getTemplateName()
    {
        return "home.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  213 => 28,  84 => 29,  82 => 28,  76 => 24,  72 => 23,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block staticlinks %}
<!--<script src=\"//code.highcharts.com/stock/highstock.js\"></script>
<script src=\"//code.highcharts.com/modules/heatmap.js\"></script>

<script src=\"//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js\"></script>
<script src=\"//code.highcharts.com/maps/modules/map.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/world-robinson.js\"></script>
<script src=\"//code.highcharts.com/mapdata/custom/europe.js\"></script>

<script src=\"//code.highcharts.com/stock/indicators/indicators.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/ema.js\"></script>
<script src=\"//code.highcharts.com/stock/indicators/bollinger-bands.js\"></script>

<script src=\"static/script-fincontagion.js\"></script>
<script src=\"static/mapGenerator.js\"></script>
<script src=\"static/tsGenerator.js\"></script>
-->
{% endblock %}


{% block content %}
    <div class=\"overlay\">
    </div>
    
    <section class=\"container\">
        {% block description %}{% endblock %}
    </section>
    
    
    <section class=\"container\" id=\"spinnercontainer\" style=\"\">
        <div class=\"row\">
            <div class=\"text-center col-12\"><h4 style=\"text-align:center\" id=\"loadmessage\">Loading data and making graphs...</h4></div>
        </div>
        <div class=\"row\">
            <div class=\"sk-circle\">
                <div class=\"sk-circle1 sk-child\"></div>
                <div class=\"sk-circle2 sk-child\"></div>
                <div class=\"sk-circle3 sk-child\"></div>
                <div class=\"sk-circle4 sk-child\"></div>
                <div class=\"sk-circle5 sk-child\"></div>
                <div class=\"sk-circle6 sk-child\"></div>
                <div class=\"sk-circle7 sk-child\"></div>
                <div class=\"sk-circle8 sk-child\"></div>
                <div class=\"sk-circle9 sk-child\"></div>
                <div class=\"sk-circle10 sk-child\"></div>
                <div class=\"sk-circle11 sk-child\"></div>
                <div class=\"sk-circle12 sk-child\"></div>
            </div>
        </div>
    </section>
    
    <section class=\"container\" style=\"margin-bottom:20px\">
        <form class=\"form-inline\" method=\"post\" action=\"\" id=\"corrselector\">
            <div class = \"form-group\">
                <label for=\"freqtrail\" style=\"font-weight:600\" >Data frequency</label>
                <select class=\"form-control form-control-sm\" id=\"freqtrail\"></select>
                <input type=\"hidden\" id=\"freq\" name=\"freq\"></input>
                <input type=\"hidden\" id=\"trail\" name=\"trail\"></input>
            </div>
            <div class = \"form-group\" style=\"margin-left:10px\">
                <label for=\"corr_type\" style=\"font-weight:600\" >Correlation Type</label>
                <select class=\"form-control form-control-sm\" name=\"corr_type\" id=\"corr_type\"></select>
                <button class=\"btn btn-primary btn-sm\" type=\"submit\" id=\"submitcorrselector\" >Change</button>
            </div>
        </form>
    </section>

    <section class=\"container\" id=\"resultscontainer\">
        <ul class=\"nav nav-tabs\" id=\"myTab\" role=\"tablist\">
            
          <li class=\"nav-item\">
            <a class=\"nav-link active\" data-toggle=\"tab\" href=\"#heatmaptab\" role=\"tab\" aria-selected=\"true\">Correlation Matrix</a>
          </li>

            
          <li class=\"nav-item\">
            <a class=\"nav-link\" data-toggle=\"tab\" href=\"#maptab\" role=\"tab\">Correlation Map</a>
          </li>
          
          <li class=\"nav-item\">
            <a class=\"nav-link\" data-toggle=\"tab\" href=\"#tstab\" role=\"tab\">Historical Correlation Data</a>
          </li>

        </ul>
        
        
        <div class=\"tab-content\" id=\"myTabContent\">
            
          <div class=\"tab-pane fade show active\" id=\"heatmaptab\" role=\"tabpanel\" >
            <div class=\"container\">    
                <div class=\"row\">
                    <div class=\"col-lg-12\">
                        <div id=\"heatmap\"></div>
                    </div>
                </div>
            </div>
          </div>

            
          <div class=\"tab-pane fade\" id=\"maptab\" role=\"tabpanel\" style=\"background:url('static/bg-parchment.png') no-repeat center center fixed;background-size: cover;\">
                <form class=\"form-inline\">
                    <div class = \"form-group\">
                        <label for=\"showLines\" style=\"font-weight:600\" >Draw connections between closely correlated countries?</label>
                        <input type=\"checkbox\" checked=\"checked\" name=\"showLines\" id=\"showLines\">
                    </div>
                </form>
                <form class=\"form-inline\">
                    <div class = \"form-group\">
                        <label for=\"minLines\"  style=\"font-weight:600\"  >Minimum correlation (0 to 1):</label>
                        <input type=\"text\" class=\"form-control form-control-sm\" id=\"minLines\" value=\"0.75\" style=\"max-width:80px\">
                        <button class=\"btn btn-primary btn-sm\" type=\"button\" id=\"submitLines\" >Submit</button>
                        <div id=\"errormessageLines\" class=\"invalid-feedback\">Error Message!</div>
                    </div>
                </form>
                <div class=\"row\">
                    <div class=\"col-lg-12\" id=\"highMap\"></div>
                </div>
                
                <div class=\"row\">
                    <div></div>
                    <div class=\"col-lg-12 float-right\" id=\"highMapEurope\"></div>
                </div>
          </div>
          
          <div class=\"tab-pane fade\" id=\"tstab\" role=\"tabpanel\" style=\"\">
                <form class=\"form-inline\">
                    <div class = \"form-group\">
                        <label for=\"corr_1\" style=\"font-weight:600\" >Get historical correlation for: </label>
                        <select class=\"selectcorr form-control form-control-sm\" id=\"corr_1\">
                        </select>
                        <label for=\"corr_2\" style=\"font-weight:600\" > and </label>
                        <select class=\"selectcorr form-control form-control-sm\" id=\"corr_2\">
                        </select>
                        <button class=\"btn btn-primary btn-sm\" type=\"button\" id=\"submitTS\" >Go</button>
                        <div id=\"errormessageTS\" class=\"invalid-feedback\">Error Message!</div>
                    </div>
                </form>
                
                
                <div class=\"row\">
                    <div class=\"col-lg-12\" id=\"tsChart\"></div>
                </div>
          </div>
          

          
        </div>
    </section>
    
    <section class=\"container\">
    </section>
{% endblock %}", "home.html", "/var/www/econforecasting.com/public/templates/home.html");
    }
}
