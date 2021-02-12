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

/* fc-rates-t-info.html */
class __TwigTemplate_df9a1e7b938eb8413bb147a90b83b0ea9f0c34d6927ca97ed887da8f67da7044 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'meta' => [$this, 'block_meta'],
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
        $this->parent = $this->loadTemplate("base.html", "fc-rates-t-info.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data are provided using our model.\"/>
";
    }

    // line 7
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "<script src=\"https://code.highcharts.com/8.2/highcharts-more.js\"></script>
<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>
<script type=\"text/javascript\" id=\"MathJax-script\" async src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\"></script>
<script>
MathJax = {
  tex: {
    inlineMath: [['\$', '\$'], ['\\\\(', '\\\\)']]
  }
};
</script>
";
    }

    // line 20
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 21
        echo "<div class=\"row gx-0\">
\t";
        // line 22
        $this->loadTemplate("fc-rates-sidebar.html", "fc-rates-t-info.html", 22)->display($context);
        // line 23
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t
\t\t\t<div class=\"col-xl-7 col-md-7 col-sm-12\">
\t\t\t\t<h2 class=\"text-decoration-underline\">Overview</h2>
\t\t\t\t<p>Treasury yields are the return provided by U.S. federal government-issued debt of varying maturity lengths. These returns serve as an important benchmark interest rate in the economy.</p>
\t\t\t\t<p>This model aims to provide monthly Treasury yields using information gleaned from spot yields and futures markets. Since the model is directly built from market rates and uses minimal extraneous assumptions, these forecasts can be interpreted as a market consensus of future Treasury yield rates.</p>
\t\t\t\t
\t\t\t\t<h3 class=\"text-decoration-underline\">Methodology</h3>
\t\t\t\t<p>The current shape of the yield curve can be used to estimate some forecasts of some parts of the yield curve. For example, knowing today's 3-month Treasury yield and today's 6-month Treasury yield allows one to compute the forecasted 3-month Treasury yield three months from now - it is the percent difference between today's 3 and 6 month yields, after adjusting for annualization.</p>
\t\t\t\t
\t\t\t\t<p>However, this leaves us with some problems. How would one go about forecasting the same 3-month Treasury yield four months from now? The previous method would only be feasible if there was a 7-month Treasury bill trading on the market - but no such thing exists. We therefore need to impute this 7-month Treasury yield, as well as the 8-month, 9-month, and so on.</p>
\t\t\t\t
\t\t\t\t<p>One can see that in order to attain a full 10-year forecast of the Treasury curve, it is necessary to derive the value of the Treasury curve at all maturities. However, only maturity lengths of 1-month, 3-month, 6-month, 1-year, etc., durations are traded on both primary and secondary markets.</p>
\t\t\t\t<p>To fill in these holes in the yield curve, we use a Nelson-Siegel (1987) framework. This will allow us to effectively capture the shape of the entire Treasury yield curve with only four parameters. In particular, the shape is capture by the function below (Diebold and Li, 2006).</p>
\t\t\t\t\$\$y_{\\tau, t} = \\beta_{1, t} + \\beta_{2, t} \\frac{1- e^{-\\lambda \\tau}}{\\lambda \\tau} + \\beta_{3, t}\\left(\\frac{1- e^{-\\lambda \\tau}}{\\lambda \\tau}\\right) - e^{-\\lambda \\tau},\$\$
\t\t\t\twhere \$\\tau\$ refers to the number of months until maturity in months, the \$\\beta\$ parameters are the curve-fitting parameters to be estimated, and the \$\\lambda\$ parameter represents a hyperparameter to be estimated. This function will allow us to feed a few data points for available Treasury yields - for example, the 3 month, 6 month, 1 year, 20 year, 30 year, etc., and in return receive a fully specified curve - allowing us to impute the Treasury yield at <i>any</i> maturity, e.g. for the 7 months described earlier.</p>
\t\t\t\t
\t\t\t\t<p>We begin by importing data on Treasury yields from the St. Louis Federal Reserve Database for maturities of length 1-month, 3-month, 6-month, 1-year, 2-year, 5-year, 10-year, 20-year, and 30-year, of daily frequence starting 90 days prior to today. We now assume a \$\\lambda\$ hyperparameter value between 0 and 1. Then, for each date in our historical dataset, we take the Treasury yield data for that date only and run an OLS regression to estimate \$\\widehat{\\beta_1}\$, \$\\widehat{\\beta_2}\$, and \$\\widehat{\\beta_3}\$ in the above equation. The maximum absolute percentage error (MAPE) is calculated. This process is repeated for all 90 dates. Finally, the average MAPE across all 90 days is calculated. This process is then repeated using alternative guesses of \$\\lambda\$ using a gradient descent procedure, until the \$\\lambda\$ giving the lowest average MAPE is found.</p>
\t\t\t\t
\t\t\t\t<p>Once the optimal hyperparameter \$\\lambda\$ is found, we take the \$\\widehat{\\beta_1}\$, \$\\widehat{\\beta_2}\$, and \$\\widehat{\\beta_3}\$ computed using that \$\\lambda\$ value for the most recent date of historical value. These four values - the hyperparameter and 3 curve-fitting parameters - will give us our full yield curve. Substituting these values back into the Nelson-Siegel equation along with values of \$\\tau\$ from 1 to 360 now gives us the imputed Treasury yield curve for every maturity from 1 month, 2 months, 3 months, ..., until 360 months (30 years). These values can then be used to derive the <a href=\"/fc-rates-tcurve\">10-year forecast for the full Treasury yield curve</a>.</p>
\t\t\t</div>

\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-4 col-sm-10\" style=\"background-color:rgba(200, 200, 250, .1)\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h6>For a full 10-year forecast of all Treasury yields, please click <a href=\"/fc-rates-tcurve\">here.</a></h6>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">*forecasted values</h6>
\t\t\t\t<table id=\"table-container\" class=\"table summary-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t
\t\t</div>
\t\t

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "fc-rates-t-info.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  84 => 23,  82 => 22,  79 => 21,  75 => 20,  61 => 8,  57 => 7,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"Monthly 3-month, 6-month, 1-year, 5-year, 10-year, 20-year, and 30-year Treasury yield forecasts and historical data are provided using our model.\"/>
{% endblock %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/8.2/highcharts-more.js\"></script>
<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>
<script type=\"text/javascript\" id=\"MathJax-script\" async src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\"></script>
<script>
MathJax = {
  tex: {
    inlineMath: [['\$', '\$'], ['\\\\(', '\\\\)']]
  }
};
</script>
{% endblock %}

{% block content %}
<div class=\"row gx-0\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-9 m-auto pt-0 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-xl-9 col-lg-10 col-12-md\">
\t\t\t</div>
\t\t</div>
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t
\t\t\t<div class=\"col-xl-7 col-md-7 col-sm-12\">
\t\t\t\t<h2 class=\"text-decoration-underline\">Overview</h2>
\t\t\t\t<p>Treasury yields are the return provided by U.S. federal government-issued debt of varying maturity lengths. These returns serve as an important benchmark interest rate in the economy.</p>
\t\t\t\t<p>This model aims to provide monthly Treasury yields using information gleaned from spot yields and futures markets. Since the model is directly built from market rates and uses minimal extraneous assumptions, these forecasts can be interpreted as a market consensus of future Treasury yield rates.</p>
\t\t\t\t
\t\t\t\t<h3 class=\"text-decoration-underline\">Methodology</h3>
\t\t\t\t<p>The current shape of the yield curve can be used to estimate some forecasts of some parts of the yield curve. For example, knowing today's 3-month Treasury yield and today's 6-month Treasury yield allows one to compute the forecasted 3-month Treasury yield three months from now - it is the percent difference between today's 3 and 6 month yields, after adjusting for annualization.</p>
\t\t\t\t
\t\t\t\t<p>However, this leaves us with some problems. How would one go about forecasting the same 3-month Treasury yield four months from now? The previous method would only be feasible if there was a 7-month Treasury bill trading on the market - but no such thing exists. We therefore need to impute this 7-month Treasury yield, as well as the 8-month, 9-month, and so on.</p>
\t\t\t\t
\t\t\t\t<p>One can see that in order to attain a full 10-year forecast of the Treasury curve, it is necessary to derive the value of the Treasury curve at all maturities. However, only maturity lengths of 1-month, 3-month, 6-month, 1-year, etc., durations are traded on both primary and secondary markets.</p>
\t\t\t\t<p>To fill in these holes in the yield curve, we use a Nelson-Siegel (1987) framework. This will allow us to effectively capture the shape of the entire Treasury yield curve with only four parameters. In particular, the shape is capture by the function below (Diebold and Li, 2006).</p>
\t\t\t\t\$\$y_{\\tau, t} = \\beta_{1, t} + \\beta_{2, t} \\frac{1- e^{-\\lambda \\tau}}{\\lambda \\tau} + \\beta_{3, t}\\left(\\frac{1- e^{-\\lambda \\tau}}{\\lambda \\tau}\\right) - e^{-\\lambda \\tau},\$\$
\t\t\t\twhere \$\\tau\$ refers to the number of months until maturity in months, the \$\\beta\$ parameters are the curve-fitting parameters to be estimated, and the \$\\lambda\$ parameter represents a hyperparameter to be estimated. This function will allow us to feed a few data points for available Treasury yields - for example, the 3 month, 6 month, 1 year, 20 year, 30 year, etc., and in return receive a fully specified curve - allowing us to impute the Treasury yield at <i>any</i> maturity, e.g. for the 7 months described earlier.</p>
\t\t\t\t
\t\t\t\t<p>We begin by importing data on Treasury yields from the St. Louis Federal Reserve Database for maturities of length 1-month, 3-month, 6-month, 1-year, 2-year, 5-year, 10-year, 20-year, and 30-year, of daily frequence starting 90 days prior to today. We now assume a \$\\lambda\$ hyperparameter value between 0 and 1. Then, for each date in our historical dataset, we take the Treasury yield data for that date only and run an OLS regression to estimate \$\\widehat{\\beta_1}\$, \$\\widehat{\\beta_2}\$, and \$\\widehat{\\beta_3}\$ in the above equation. The maximum absolute percentage error (MAPE) is calculated. This process is repeated for all 90 dates. Finally, the average MAPE across all 90 days is calculated. This process is then repeated using alternative guesses of \$\\lambda\$ using a gradient descent procedure, until the \$\\lambda\$ giving the lowest average MAPE is found.</p>
\t\t\t\t
\t\t\t\t<p>Once the optimal hyperparameter \$\\lambda\$ is found, we take the \$\\widehat{\\beta_1}\$, \$\\widehat{\\beta_2}\$, and \$\\widehat{\\beta_3}\$ computed using that \$\\lambda\$ value for the most recent date of historical value. These four values - the hyperparameter and 3 curve-fitting parameters - will give us our full yield curve. Substituting these values back into the Nelson-Siegel equation along with values of \$\\tau\$ from 1 to 360 now gives us the imputed Treasury yield curve for every maturity from 1 month, 2 months, 3 months, ..., until 360 months (30 years). These values can then be used to derive the <a href=\"/fc-rates-tcurve\">10-year forecast for the full Treasury yield curve</a>.</p>
\t\t\t</div>

\t\t\t<div class=\"card border-secondary border-2 m-2 col-xl-4 col-md-4 col-sm-10\" style=\"background-color:rgba(200, 200, 250, .1)\">
\t\t\t\t<div class=\"card-body\">
\t\t\t\t<h6>For a full 10-year forecast of all Treasury yields, please click <a href=\"/fc-rates-tcurve\">here.</a></h6>
\t\t\t\t<h6 class=\"card-subtitle mb-2 text-muted fst-italic\">*forecasted values</h6>
\t\t\t\t<table id=\"table-container\" class=\"table summary-table w-100\"></table>
\t\t\t\t</div>
\t\t\t</div>

\t\t
\t\t</div>
\t\t

\t\t
\t</div>
</div>
{% endblock %}", "fc-rates-t-info.html", "/var/www/econforecasting.com/public/templates/fc-rates-t-info.html");
    }
}
