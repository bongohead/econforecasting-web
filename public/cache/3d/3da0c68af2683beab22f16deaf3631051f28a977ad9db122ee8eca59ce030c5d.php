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
class __TwigTemplate_a55cd274f18e742922e2e27c899e01278db6731180d7fa49b74effd8e61bb72b extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
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
    <meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">

    <title>";
        // line 8
        echo twig_escape_filter($this->env, ($context["title"] ?? null));
        echo "</title>
    <link rel=\"icon\" type=image/ico href=\"/static/favicon.ico\"/>
    <meta name=description content=\"Content.\" />
    <meta name=keywords content=\"financial contagion, financial contagion index, cross-asset contagion, cross-asset contagion\" />
\t
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
\t<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">
\t
\t
\t  <link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.6.3/css/all.css\" integrity=\"sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/\" crossorigin=\"anonymous\"></head>

\t<!--<link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css\"/> -->

\t<script src=\"https://code.jquery.com/jquery-3.5.1.min.js\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" crossorigin=\"anonymous\"></script>
\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx\" crossorigin=\"anonymous\"></script>
\t
\t<!--
\t<script src=\"//cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js\"></script>
\t<script src=\"//cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js\"></script>
\t
\t<script src=\"//cdn.datatables.net/buttons/1.5.6/js/dataTables.buttons.min.js\"></script>
\t<script src=\"//cdn.datatables.net/buttons/1.5.6/js/buttons.html5.min.js\"></script> <!-- HTML export buttons -->
\t
    <script src=\"//code.highcharts.com/stock/highstock.js\"></script>
\t<script src=\"https://cye131.github.io/gradient.js/gradient-min.js\"></script>
\t<!--
\t<link href=\"https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css\" rel=\"stylesheet\">
\t<script src=\"https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js\"></script>
\t-->
    ";
        // line 37
        echo ($context["pageJS"] ?? null);
        echo "

    ";
        // line 39
        $this->displayBlock('staticlinks', $context, $blocks);
        // line 40
        echo "</head>

<body>
\t<header>
\t\t<div class=\"container-fluid\" style=\"height:.25rem;background-color:rgb(37, 48, 10);\"></div>

\t\t<nav class=\"navbar navbar-expand-md navbar-dark sticky-top\">
\t\t\t<a class=\"navbar-brand\" href=\"/\">
\t\t\t\t<img src=\"/static/logo.png\" class=\"py-0\" height=\"30\" width=\"30\">
\t\t\t\t<span class=\"navbar-brand my-0 py-0 h2\">econforecasting.com</span>
\t\t\t</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>
\t\t\t
\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t<ul class=\"navbar-nav\">\t\t\t\t\t\t
\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\"><span class=\"fas fa-chart-line mr-2\"></span>GDP Forecasts</a>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbar-detailed-accounts-label\" role=\"button\" data-toggle=\"dropdown\">
\t\t\t\t\t\t\t<span class=\"fab fa-connectdevelop mr-2\"></span>Asset Correlation
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\" id=\"navbar-detailed-accounts\">
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/ac-regions-hm\"><span style=\"margin-left: 1rem\">Cross-Regional Equity Correlation</span></a>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Equity Correlation Index</span></a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbar-detailed-accounts-label\" role=\"button\" data-toggle=\"dropdown\">
\t\t\t\t\t\t\t<span class=\"fa fa-list fa-fw mr-2\"></span>Other Forecasts...
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\" id=\"navbar-detailed-accounts\">
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates</span></a>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates2</span></a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t\t
\t\t\t\t\t<!-- Sidebar Replacement for Smaller Devices: d-none d-xs-block d-md-none will show from only XS and S screens, hide for all else. See bootstrap 4 docs for details.-->
\t\t\t\t\t<li class=\"nav-item dropdown d-none d-xs-block d-md-none\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"sidebarReplacement1\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
\t\t\t\t\t\t\tMy Account
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\" aria-labelledby=\"sidebarReplacement1\">
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\">Action</a>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\">Another action</a>
\t\t\t\t\t\t\t<div class=\"dropdown-divider\"></div>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\">Something else here</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t</nav>
\t</header>
\t

\t<div class=\"container-fluid\">
\t<div class=\"row flex-xl-nowrap justify-content-center\">
\t\t\t";
        // line 97
        $this->displayBlock('content', $context, $blocks);
        // line 99
        echo "\t</div>
\t</div>

\t<footer class=\"container-fluid bg-secondary text-white text-center text-lg-start\">
\t  <!-- Grid container -->
\t  <div class=\"container p-4\">
\t\t<!--Grid row-->
\t\t<div class=\"row\">
\t\t  <!--Grid column-->
\t\t  <!--
\t\t  <div class=\"col-lg-6 col-md-12 mb-4 mb-md-0\">
\t\t\t<h5 class=\"text-uppercase\">Footer Content</h5>

\t\t\t<p>
\t\t\t  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
\t\t\t  molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
\t\t\t  voluptatem veniam, est atque cumque eum delectus sint!
\t\t\t</p>
\t\t  </div>
\t\t  -->
\t\t  <!--Grid column-->

\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-4 mb-md-0\">
\t\t\t<h5 class=\"text-uppercase\">Links</h5>

\t\t\t<ul class=\"list-unstyled mb-0\">
\t\t\t  <li>
\t\t\t\t<a href=\"https://cmefi.com\" class=\"text-white\">Center for Macroeconomic Forecasting and Insights</a>
\t\t\t  </li>
\t\t\t</ul>
\t\t  </div>
\t\t  <!--Grid column-->

\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-4 mb-md-0\">
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
\t  <div class=\"text-center p-3\" style=\"background-color: rgba(0, 0, 0, 0.2)\">
\t\t© 2021 Copyright:
\t\t<a class=\"text-white\" href=\"mailto:charles@cmefi.com\">C. YE</a>
\t  </div>
\t  <!-- Copyright -->
\t</footer>

\t

        
        
        
<div class=\"overlay h-100\" id=\"overlay\" style=\"display:none\">
    <div class=\"row h-25\">
        <div class=\"\"></div>
    </div>
    <div class=\"row\">
        <div class=\"text-center col-12\"><h4 style=\"text-align:center\" id=\"loadmessage\">Loading ...</h4></div>
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
</div>


<script>
  ";
        // line 189
        echo ($context["bodyScript"] ?? null);
        echo "
</script>

</body>

</html>";
    }

    // line 39
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 97
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 98
        echo "\t\t\t";
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
        return array (  260 => 98,  256 => 97,  250 => 39,  240 => 189,  148 => 99,  146 => 97,  87 => 40,  85 => 39,  80 => 37,  48 => 8,  39 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<!DOCTYPE html>
<html lang=\"en-US\">

<head>
    <meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">

    <title>{{ title|e }}</title>
    <link rel=\"icon\" type=image/ico href=\"/static/favicon.ico\"/>
    <meta name=description content=\"Content.\" />
    <meta name=keywords content=\"financial contagion, financial contagion index, cross-asset contagion, cross-asset contagion\" />
\t
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
\t<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css\" integrity=\"sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2\" crossorigin=\"anonymous\">
\t
\t
\t  <link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.6.3/css/all.css\" integrity=\"sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/\" crossorigin=\"anonymous\"></head>

\t<!--<link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css\"/> -->

\t<script src=\"https://code.jquery.com/jquery-3.5.1.min.js\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" crossorigin=\"anonymous\"></script>
\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx\" crossorigin=\"anonymous\"></script>
\t
\t<!--
\t<script src=\"//cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js\"></script>
\t<script src=\"//cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js\"></script>
\t
\t<script src=\"//cdn.datatables.net/buttons/1.5.6/js/dataTables.buttons.min.js\"></script>
\t<script src=\"//cdn.datatables.net/buttons/1.5.6/js/buttons.html5.min.js\"></script> <!-- HTML export buttons -->
\t
    <script src=\"//code.highcharts.com/stock/highstock.js\"></script>
\t<script src=\"https://cye131.github.io/gradient.js/gradient-min.js\"></script>
\t<!--
\t<link href=\"https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css\" rel=\"stylesheet\">
\t<script src=\"https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js\"></script>
\t-->
    {{ pageJS | raw }}

    {% block staticlinks %}{% endblock %}
</head>

<body>
\t<header>
\t\t<div class=\"container-fluid\" style=\"height:.25rem;background-color:rgb(37, 48, 10);\"></div>

\t\t<nav class=\"navbar navbar-expand-md navbar-dark sticky-top\">
\t\t\t<a class=\"navbar-brand\" href=\"/\">
\t\t\t\t<img src=\"/static/logo.png\" class=\"py-0\" height=\"30\" width=\"30\">
\t\t\t\t<span class=\"navbar-brand my-0 py-0 h2\">econforecasting.com</span>
\t\t\t</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>
\t\t\t
\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t<ul class=\"navbar-nav\">\t\t\t\t\t\t
\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\"><span class=\"fas fa-chart-line mr-2\"></span>GDP Forecasts</a>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbar-detailed-accounts-label\" role=\"button\" data-toggle=\"dropdown\">
\t\t\t\t\t\t\t<span class=\"fab fa-connectdevelop mr-2\"></span>Asset Correlation
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\" id=\"navbar-detailed-accounts\">
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/ac-regions-hm\"><span style=\"margin-left: 1rem\">Cross-Regional Equity Correlation</span></a>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Equity Correlation Index</span></a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbar-detailed-accounts-label\" role=\"button\" data-toggle=\"dropdown\">
\t\t\t\t\t\t\t<span class=\"fa fa-list fa-fw mr-2\"></span>Other Forecasts...
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\" id=\"navbar-detailed-accounts\">
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates</span></a>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates2</span></a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t\t
\t\t\t\t\t<!-- Sidebar Replacement for Smaller Devices: d-none d-xs-block d-md-none will show from only XS and S screens, hide for all else. See bootstrap 4 docs for details.-->
\t\t\t\t\t<li class=\"nav-item dropdown d-none d-xs-block d-md-none\">
\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"sidebarReplacement1\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
\t\t\t\t\t\t\tMy Account
\t\t\t\t\t\t</a>
\t\t\t\t\t\t<div class=\"dropdown-menu\" aria-labelledby=\"sidebarReplacement1\">
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\">Action</a>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\">Another action</a>
\t\t\t\t\t\t\t<div class=\"dropdown-divider\"></div>
\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\">Something else here</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t</nav>
\t</header>
\t

\t<div class=\"container-fluid\">
\t<div class=\"row flex-xl-nowrap justify-content-center\">
\t\t\t{% block content %}
\t\t\t{% endblock %}
\t</div>
\t</div>

\t<footer class=\"container-fluid bg-secondary text-white text-center text-lg-start\">
\t  <!-- Grid container -->
\t  <div class=\"container p-4\">
\t\t<!--Grid row-->
\t\t<div class=\"row\">
\t\t  <!--Grid column-->
\t\t  <!--
\t\t  <div class=\"col-lg-6 col-md-12 mb-4 mb-md-0\">
\t\t\t<h5 class=\"text-uppercase\">Footer Content</h5>

\t\t\t<p>
\t\t\t  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
\t\t\t  molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
\t\t\t  voluptatem veniam, est atque cumque eum delectus sint!
\t\t\t</p>
\t\t  </div>
\t\t  -->
\t\t  <!--Grid column-->

\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-4 mb-md-0\">
\t\t\t<h5 class=\"text-uppercase\">Links</h5>

\t\t\t<ul class=\"list-unstyled mb-0\">
\t\t\t  <li>
\t\t\t\t<a href=\"https://cmefi.com\" class=\"text-white\">Center for Macroeconomic Forecasting and Insights</a>
\t\t\t  </li>
\t\t\t</ul>
\t\t  </div>
\t\t  <!--Grid column-->

\t\t  <!--Grid column-->
\t\t  <div class=\"col-6 mb-4 mb-md-0\">
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
\t  <div class=\"text-center p-3\" style=\"background-color: rgba(0, 0, 0, 0.2)\">
\t\t© 2021 Copyright:
\t\t<a class=\"text-white\" href=\"mailto:charles@cmefi.com\">C. YE</a>
\t  </div>
\t  <!-- Copyright -->
\t</footer>

\t

        
        
        
<div class=\"overlay h-100\" id=\"overlay\" style=\"display:none\">
    <div class=\"row h-25\">
        <div class=\"\"></div>
    </div>
    <div class=\"row\">
        <div class=\"text-center col-12\"><h4 style=\"text-align:center\" id=\"loadmessage\">Loading ...</h4></div>
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
</div>


<script>
  {{ bodyScript |raw }}
</script>

</body>

</html>", "base.html", "/var/www/econforecasting.com/public/templates/base.html");
    }
}
