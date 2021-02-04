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
    <meta name=\"description\" content=\"";
        // line 6
        echo twig_escape_filter($this->env, ($context["description"] ?? null));
        echo "\"/>
\t<meta name=\"robots\" content=\"index, follow\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">
    ";
        // line 9
        $this->displayBlock('meta', $context, $blocks);
        // line 10
        echo "
    <title>";
        // line 11
        echo twig_escape_filter($this->env, ($context["title"] ?? null));
        echo "</title>
    <link rel=\"icon\" type=image/ico href=\"/static/cmefi_short.png\"/>
\t
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
\t<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1\" crossorigin=\"anonymous\">
\t<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css\">
\t<link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.6.3/css/all.css\" integrity=\"sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/\" crossorigin=\"anonymous\">

\t<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.10.23/css/dataTables.bootstrap5.min.css\"/>

\t<script src=\"https://code.jquery.com/jquery-3.5.1.min.js\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" crossorigin=\"anonymous\"></script>
\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW\" crossorigin=\"anonymous\"></script>

\t<script src=\"https://cdn.datatables.net/1.10.23/js/jquery.dataTables.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/1.10.23/js/dataTables.bootstrap5.min.js\"></script>
\t
\t<script src=\"https://cdn.datatables.net/buttons/1.6.5/js/dataTables.buttons.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/buttons/1.6.5/js/buttons.html5.min.js\"></script> <!-- HTML export buttons -->
\t
    <script src=\"https://code.highcharts.com/stock/highstock.js\"></script>
\t<script src=\"https://code.highcharts.com/modules/boost.js\"></script>
\t
\t<script src=\"https://cye131.github.io/gradient.js/gradient-min.js\"></script>
    ";
        // line 34
        echo ($context["pageJS"] ?? null);
        echo "

    ";
        // line 36
        $this->displayBlock('staticlinks', $context, $blocks);
        // line 37
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
\t\t<div class=\"container-fluid\" style=\"height:.25rem;background-color:rgb(37, 48, 10);\"></div>

\t\t<nav class=\"navbar navbar-expand-md navbar-dark sticky-top py-1\">
\t\t\t<div class=\"container-fluid\">
\t\t\t\t<a class=\"navbar-brand py-0 ps-3\" href=\"/\">
\t\t\t\t\t<img src=\"/static/cmefi_full_inverted.png\" alt=\"CMEFI Logo\" class=\"py-0\" height=\"55\">
\t\t\t\t\t<!--<span class=\"navbar-brand my-0 py-0 h2\">The Center for Macroeconomic Forecasts & Insights</span>-->
\t\t\t\t</a>
\t\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>
\t\t\t\t
\t\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t\t<ul class=\"navbar-nav me-auto\">\t\t\t\t\t\t
\t\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\"><i class=\"bi bi-bar-chart me-1\"></i>GDP Forecasts</a>
\t\t\t\t\t\t</li>
\t\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t\t<i class=\"bi bi-bar-chart-steps me-1\"></i>Other Forecasts...
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates</span></a></li>
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates2</span></a></li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</li>
\t\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t\t<i class=\"bi bi-gear-wide-connected me-1\"></i>Indicators and Indices
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-assets\"><span style=\"margin-left: 1rem\">Asset Correlation Index</span></a></li>
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-regions\"><span style=\"margin-left: 1rem\">Regional Correlation Index</span></a></li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</li>
\t\t\t\t\t\t
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t</div>
\t\t</nav>
\t</header>
\t
\t<main class=\"flex-shrink-0 min-vh-100 pb-5\">
\t\t";
        // line 91
        $this->displayBlock('content', $context, $blocks);
        // line 93
        echo "\t</main>

\t<footer class=\"container-fluid bg-secondary text-white text-center text-lg-start px-0\">
\t  <!-- Grid container -->
\t  <div class=\"container p-4\">
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
\t  <div class=\"text-end p-3\" style=\"background-color: rgba(0, 0, 0, 0.2)\">
\t\t<span>© 2021 The Center for Macroeconomic Forecasts & Insights</span>
\t  </div>
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
        // line 166
        echo ($context["bodyScript"] ?? null);
        echo "
\t</script>

</body>
</html>";
    }

    // line 9
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 36
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 91
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 92
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
        return array (  249 => 92,  245 => 91,  239 => 36,  233 => 9,  224 => 166,  149 => 93,  147 => 91,  91 => 37,  89 => 36,  84 => 34,  58 => 11,  55 => 10,  53 => 9,  47 => 6,  40 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<!DOCTYPE html>
<html lang=\"en-US\">

<head>
\t<meta charset=\"utf-8\">
    <meta name=\"description\" content=\"{{ description | e}}\"/>
\t<meta name=\"robots\" content=\"index, follow\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">
    {% block meta %}{% endblock %}

    <title>{{ title|e }}</title>
    <link rel=\"icon\" type=image/ico href=\"/static/cmefi_short.png\"/>
\t
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
\t<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1\" crossorigin=\"anonymous\">
\t<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css\">
\t<link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.6.3/css/all.css\" integrity=\"sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/\" crossorigin=\"anonymous\">

\t<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.10.23/css/dataTables.bootstrap5.min.css\"/>

\t<script src=\"https://code.jquery.com/jquery-3.5.1.min.js\" integrity=\"sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=\" crossorigin=\"anonymous\"></script>
\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW\" crossorigin=\"anonymous\"></script>

\t<script src=\"https://cdn.datatables.net/1.10.23/js/jquery.dataTables.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/1.10.23/js/dataTables.bootstrap5.min.js\"></script>
\t
\t<script src=\"https://cdn.datatables.net/buttons/1.6.5/js/dataTables.buttons.min.js\"></script>
\t<script src=\"https://cdn.datatables.net/buttons/1.6.5/js/buttons.html5.min.js\"></script> <!-- HTML export buttons -->
\t
    <script src=\"https://code.highcharts.com/stock/highstock.js\"></script>
\t<script src=\"https://code.highcharts.com/modules/boost.js\"></script>
\t
\t<script src=\"https://cye131.github.io/gradient.js/gradient-min.js\"></script>
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
\t\t<div class=\"container-fluid\" style=\"height:.25rem;background-color:rgb(37, 48, 10);\"></div>

\t\t<nav class=\"navbar navbar-expand-md navbar-dark sticky-top py-1\">
\t\t\t<div class=\"container-fluid\">
\t\t\t\t<a class=\"navbar-brand py-0 ps-3\" href=\"/\">
\t\t\t\t\t<img src=\"/static/cmefi_full_inverted.png\" alt=\"CMEFI Logo\" class=\"py-0\" height=\"55\">
\t\t\t\t\t<!--<span class=\"navbar-brand my-0 py-0 h2\">The Center for Macroeconomic Forecasts & Insights</span>-->
\t\t\t\t</a>
\t\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>
\t\t\t\t
\t\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t\t<ul class=\"navbar-nav me-auto\">\t\t\t\t\t\t
\t\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\"><i class=\"bi bi-bar-chart me-1\"></i>GDP Forecasts</a>
\t\t\t\t\t\t</li>
\t\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t\t<i class=\"bi bi-bar-chart-steps me-1\"></i>Other Forecasts...
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates</span></a></li>
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/transactions?account=\"><span style=\"margin-left: 1rem\">Rates2</span></a></li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</li>
\t\t\t\t\t\t<li class=\"nav-item dropdown\">
\t\t\t\t\t\t\t<a class=\"nav-link dropdown-toggle\" href=\"#\" data-bs-toggle=\"dropdown\">
\t\t\t\t\t\t\t\t<i class=\"bi bi-gear-wide-connected me-1\"></i>Indicators and Indices
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t<ul class=\"dropdown-menu\">
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-assets\"><span style=\"margin-left: 1rem\">Asset Correlation Index</span></a></li>
\t\t\t\t\t\t\t\t<li><a class=\"dropdown-item\" href=\"/ac-regions\"><span style=\"margin-left: 1rem\">Regional Correlation Index</span></a></li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</li>
\t\t\t\t\t\t
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t</div>
\t\t</nav>
\t</header>
\t
\t<main class=\"flex-shrink-0 min-vh-100 pb-5\">
\t\t{% block content %}
\t\t{% endblock %}
\t</main>

\t<footer class=\"container-fluid bg-secondary text-white text-center text-lg-start px-0\">
\t  <!-- Grid container -->
\t  <div class=\"container p-4\">
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
\t  <div class=\"text-end p-3\" style=\"background-color: rgba(0, 0, 0, 0.2)\">
\t\t<span>© 2021 The Center for Macroeconomic Forecasts & Insights</span>
\t  </div>
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
</html>", "base.html", "/var/www/econforecasting.com/public/templates/base.html");
    }
}
