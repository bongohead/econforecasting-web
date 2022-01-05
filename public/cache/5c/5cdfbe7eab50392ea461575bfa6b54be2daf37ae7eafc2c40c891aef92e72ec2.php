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

/* base.html */
class __TwigTemplate_e52fec9a3898517f99edb6a646425eb3e8cd81509151c61faca22ebd09e5727a extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
            'meta' => [$this, 'block_meta'],
            'staticlinks' => [$this, 'block_staticlinks'],
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<!DOCTYPE html>
<html lang=\"en-US\">

<head>
\t<meta charset=\"utf-8\">
\t<meta name=\"robots\" content=\"index, follow\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">
    ";
        // line 8
        $this->displayBlock('meta', $context, $blocks);
        // line 9
        echo "
    <title>";
        // line 10
        echo twig_escape_filter($this->env, ($context["title"] ?? null));
        echo "</title>
    <link rel=\"icon\" type=image/ico href=\"/static/cmefi_short.png\"/>
\t
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style-bs.css\">
\t
\t<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.11.2/css/dataTables.bootstrap5.min.css\"/>

\t<script src=\"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js\"></script>
\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js\"></script>

\t<script src=\"https://cdn.datatables.net/1.11.2/js/jquery.dataTables.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/1.11.2/js/dataTables.bootstrap5.min.js\"></script>
\t
\t<script src=\"https://cdn.datatables.net/buttons/2.0.0/js/dataTables.buttons.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/buttons/2.0.0/js/buttons.html5.min.js\"></script> <!-- HTML export buttons -->
\t
\t<!-- Version 9.0+ requires AST filtration bypass -->
\t<script src=\"https://code.highcharts.com/stock/9.2/highstock.js\"></script>
\t<script src=\"https://code.highcharts.com/9.2/modules/boost.js\"></script>
    ";
        // line 30
        echo ($context["pageJS"] ?? null);
        echo "

    ";
        // line 32
        $this->displayBlock('staticlinks', $context, $blocks);
        // line 33
        echo "\t<!-- Global site tag (gtag.js) - Google Analytics -->
\t<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-5JBMJCQQD7\"></script>
\t<script>
\t  window.dataLayer = window.dataLayer || [];
\t  function gtag(){dataLayer.push(arguments);}
\t  gtag('js', new Date());

\t  gtag('config', 'G-5JBMJCQQD7');
\t</script>
</head>

<body>
\t<header>
\t\t<div class=\"container-fluid\" style=\"height:.2rem;background-color:rgb(37, 48, 10);\"></div>

\t\t<nav class=\"navbar navbar-expand-md navbar-dark py-1 shadow-sm\">
\t\t\t<a class=\"navbar-brand py-0 ps-3\" href=\"/\">
\t\t\t\t<img src=\"/static/cmefi-full-white.svg\" alt=\"CMEFI Logo\" class=\"py-0\" height=\"45\">
\t\t\t</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>

\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t<ul class=\"navbar-nav\">\t\t\t\t\t\t
\t\t\t\t\t<!--<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\"><i class=\"bi bi-bar-chart me-1\"></i>GDP Forecasts</a>
\t\t\t\t\t</li>
\t\t\t\t\t-->
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t<i class=\"bi bi-bar-chart-steps me-1\"></i>Forecast Models
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\">
\t\t\t\t\t\t\t<div class=\"d-md-flex align-items-start justify-content-start\">
\t\t\t\t\t\t\t\t<div>   
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">TREASURY YIELDS</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-info\">Overview and Methodology</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-tcurve\">Full Treasury Yield Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-3m\">3 Month T-Bill Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-1y\">1 Year T-Note Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-10y\">10 Year T-Note Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-30y\">30 Year T-Bond Forecast</a>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">BENCHMARK RATES</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-ffr\">Federal Funds Rate Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-sofr\">SOFR Forecast</a>
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mt-4 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">MORTGAGE RATES</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-mort15y\">15-Year Mortgage Rate</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-mort30y\">30-Year Mortgage Rate</a>

\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">MACRO INDICATORS</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-macro-inf\">Inflation Rate</a>
\t\t\t\t\t\t\t\t</div>

\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t <div class=\"dropdown-divider\"></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t<i class=\"bi bi-pie-chart-fill me-1\"></i>Nowcast Models
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/nc-gdp\"><span style=\"margin-left: 1rem\">GDP & Subcomponents</span></a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</li>

\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t<i class=\"bi bi-gear-wide-connected me-1\"></i>Indicators and Indices
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-assets\"><span style=\"margin-left: 1rem\">Asset Correlation Index</span></a></li>
\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-regions\"><span style=\"margin-left: 1rem\">Regional Correlation Index</span></a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</li>
\t\t\t\t\t
\t\t\t\t</ul>
\t\t\t</div>
\t\t</nav>
\t</header>
\t
\t<main >
\t\t";
        // line 118
        $this->displayBlock('content', $context, $blocks);
        // line 120
        echo "\t</main>

\t<footer class=\"container-fluid text-white px-0 bg-dark\">
\t  <!-- Grid container -->
\t  <div class=\"container py-3\">
\t\t<!--Grid row-->
\t\t<div class=\"row\">
\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-2 mb-md-0\">
\t\t\t<h5 class=\"text-uppercase\">Links</h5>
\t\t\t<ul class=\"list-unstyled mb-0\">
\t\t\t  <li>
\t\t\t\t<a href=\"https://cmefi.com\" class=\"text-white\">Center for Macroeconomic Forecasting and Insights</a>
\t\t\t  </li>
\t\t\t</ul>
\t\t  </div>
\t\t  <!--Grid column-->

\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-2 mb-md-0 text-end\">
\t\t\t<h5 class=\"text-uppercase mb-0\">CONTACT</h5>

\t\t\t<ul class=\"list-unstyled\">
\t\t\t  <li>
\t\t\t\t<a href=\"mailto:charles@cmefi.com\" class=\"text-white\">Email: charles (at) cmefi (dotcom)</a>
\t\t\t  </li>
\t\t\t</ul>
\t\t  </div>
\t\t  <!--Grid column-->
\t\t</div>
\t\t<!--Grid row-->
\t  </div>
\t  <!-- Grid container -->

\t  <!-- Copyright -->
\t<div class=\"container-fluid\" style=\"background-color: rgba(0, 0, 0, 0.2)\">
\t\t<div class=\"container text-end p-2\">
\t\t\t<span>© 2021 <img class=\"mx-1\" width=\"16\" height=\"16\" src=\"/static/cmefi_short.png\"> The Center for Macroeconomic Forecasts &amp; Insights</span>
\t\t</div>
\t</div>
\t  <!-- Copyright -->
\t</footer>

\t

        
        
        
\t<div class=\"overlay h-100\" id=\"overlay\" style=\"display:none\">
\t\t<div class=\"row h-25\">
\t\t\t<div class=\"\"></div>
\t\t</div>
\t\t<div class=\"row\">
\t\t\t<div class=\"text-center col-12\"><h4 style=\"text-align:center\" id=\"loadmessage\">Loading ...</h4></div>
\t\t</div>
\t\t<div class=\"row\">
\t\t\t<div class=\"sk-circle\">
\t\t\t\t<div class=\"sk-circle1 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle2 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle3 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle4 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle5 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle6 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle7 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle8 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle9 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle10 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle11 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle12 sk-child\"></div>
\t\t\t</div>
\t\t</div>
\t</div>


\t<script>
\t  ";
        // line 195
        echo ($context["bodyScript"] ?? null);
        echo "
\t</script>

</body>
</html>";
    }

    // line 8
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 32
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 118
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 119
        echo "\t\t";
    }

    public function getTemplateName()
    {
        return "base.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  275 => 119,  271 => 118,  265 => 32,  259 => 8,  250 => 195,  173 => 120,  171 => 118,  84 => 33,  82 => 32,  77 => 30,  54 => 10,  51 => 9,  49 => 8,  40 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<!DOCTYPE html>
<html lang=\"en-US\">

<head>
\t<meta charset=\"utf-8\">
\t<meta name=\"robots\" content=\"index, follow\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">
    {% block meta %}{% endblock %}

    <title>{{title|e}}</title>
    <link rel=\"icon\" type=image/ico href=\"/static/cmefi_short.png\"/>
\t
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style-bs.css\">
\t
\t<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.11.2/css/dataTables.bootstrap5.min.css\"/>

\t<script src=\"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js\"></script>
\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js\"></script>

\t<script src=\"https://cdn.datatables.net/1.11.2/js/jquery.dataTables.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/1.11.2/js/dataTables.bootstrap5.min.js\"></script>
\t
\t<script src=\"https://cdn.datatables.net/buttons/2.0.0/js/dataTables.buttons.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/buttons/2.0.0/js/buttons.html5.min.js\"></script> <!-- HTML export buttons -->
\t
\t<!-- Version 9.0+ requires AST filtration bypass -->
\t<script src=\"https://code.highcharts.com/stock/9.2/highstock.js\"></script>
\t<script src=\"https://code.highcharts.com/9.2/modules/boost.js\"></script>
    {{ pageJS | raw }}

    {% block staticlinks %}{% endblock %}
\t<!-- Global site tag (gtag.js) - Google Analytics -->
\t<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-5JBMJCQQD7\"></script>
\t<script>
\t  window.dataLayer = window.dataLayer || [];
\t  function gtag(){dataLayer.push(arguments);}
\t  gtag('js', new Date());

\t  gtag('config', 'G-5JBMJCQQD7');
\t</script>
</head>

<body>
\t<header>
\t\t<div class=\"container-fluid\" style=\"height:.2rem;background-color:rgb(37, 48, 10);\"></div>

\t\t<nav class=\"navbar navbar-expand-md navbar-dark py-1 shadow-sm\">
\t\t\t<a class=\"navbar-brand py-0 ps-3\" href=\"/\">
\t\t\t\t<img src=\"/static/cmefi-full-white.svg\" alt=\"CMEFI Logo\" class=\"py-0\" height=\"45\">
\t\t\t</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>

\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t<ul class=\"navbar-nav\">\t\t\t\t\t\t
\t\t\t\t\t<!--<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\"><i class=\"bi bi-bar-chart me-1\"></i>GDP Forecasts</a>
\t\t\t\t\t</li>
\t\t\t\t\t-->
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t<i class=\"bi bi-bar-chart-steps me-1\"></i>Forecast Models
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\">
\t\t\t\t\t\t\t<div class=\"d-md-flex align-items-start justify-content-start\">
\t\t\t\t\t\t\t\t<div>   
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">TREASURY YIELDS</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-info\">Overview and Methodology</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-tcurve\">Full Treasury Yield Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-3m\">3 Month T-Bill Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-1y\">1 Year T-Note Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-10y\">10 Year T-Note Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-t-30y\">30 Year T-Bond Forecast</a>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">BENCHMARK RATES</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-ffr\">Federal Funds Rate Forecast</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-sofr\">SOFR Forecast</a>
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mt-4 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">MORTGAGE RATES</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-mort15y\">15-Year Mortgage Rate</a>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-rates-mort30y\">30-Year Mortgage Rate</a>

\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t\t<div class=\"dropdown-header py-0 mx-3 mb-1 border-bottom border-econgreen\" style=\"font-size:1.0rem\">MACRO INDICATORS</div>
\t\t\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/fc-macro-inf\">Inflation Rate</a>
\t\t\t\t\t\t\t\t</div>

\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t <div class=\"dropdown-divider\"></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t<i class=\"bi bi-pie-chart-fill me-1\"></i>Nowcast Models
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/nc-gdp\"><span style=\"margin-left: 1rem\">GDP & Subcomponents</span></a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</li>

\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t<i class=\"bi bi-gear-wide-connected me-1\"></i>Indicators and Indices
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-assets\"><span style=\"margin-left: 1rem\">Asset Correlation Index</span></a></li>
\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-regions\"><span style=\"margin-left: 1rem\">Regional Correlation Index</span></a></li>
\t\t\t\t\t\t</ul>
\t\t\t\t\t</li>
\t\t\t\t\t
\t\t\t\t</ul>
\t\t\t</div>
\t\t</nav>
\t</header>
\t
\t<main >
\t\t{% block content %}
\t\t{% endblock %}
\t</main>

\t<footer class=\"container-fluid text-white px-0 bg-dark\">
\t  <!-- Grid container -->
\t  <div class=\"container py-3\">
\t\t<!--Grid row-->
\t\t<div class=\"row\">
\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-2 mb-md-0\">
\t\t\t<h5 class=\"text-uppercase\">Links</h5>
\t\t\t<ul class=\"list-unstyled mb-0\">
\t\t\t  <li>
\t\t\t\t<a href=\"https://cmefi.com\" class=\"text-white\">Center for Macroeconomic Forecasting and Insights</a>
\t\t\t  </li>
\t\t\t</ul>
\t\t  </div>
\t\t  <!--Grid column-->

\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-2 mb-md-0 text-end\">
\t\t\t<h5 class=\"text-uppercase mb-0\">CONTACT</h5>

\t\t\t<ul class=\"list-unstyled\">
\t\t\t  <li>
\t\t\t\t<a href=\"mailto:charles@cmefi.com\" class=\"text-white\">Email: charles (at) cmefi (dotcom)</a>
\t\t\t  </li>
\t\t\t</ul>
\t\t  </div>
\t\t  <!--Grid column-->
\t\t</div>
\t\t<!--Grid row-->
\t  </div>
\t  <!-- Grid container -->

\t  <!-- Copyright -->
\t<div class=\"container-fluid\" style=\"background-color: rgba(0, 0, 0, 0.2)\">
\t\t<div class=\"container text-end p-2\">
\t\t\t<span>© 2021 <img class=\"mx-1\" width=\"16\" height=\"16\" src=\"/static/cmefi_short.png\"> The Center for Macroeconomic Forecasts &amp; Insights</span>
\t\t</div>
\t</div>
\t  <!-- Copyright -->
\t</footer>

\t

        
        
        
\t<div class=\"overlay h-100\" id=\"overlay\" style=\"display:none\">
\t\t<div class=\"row h-25\">
\t\t\t<div class=\"\"></div>
\t\t</div>
\t\t<div class=\"row\">
\t\t\t<div class=\"text-center col-12\"><h4 style=\"text-align:center\" id=\"loadmessage\">Loading ...</h4></div>
\t\t</div>
\t\t<div class=\"row\">
\t\t\t<div class=\"sk-circle\">
\t\t\t\t<div class=\"sk-circle1 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle2 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle3 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle4 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle5 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle6 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle7 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle8 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle9 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle10 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle11 sk-child\"></div>
\t\t\t\t<div class=\"sk-circle12 sk-child\"></div>
\t\t\t</div>
\t\t</div>
\t</div>


\t<script>
\t  {{ bodyScript |raw }}
\t</script>

</body>
</html>", "base.html", "/var/www/beta.econforecasting.com/public/templates/base.html");
    }
}
