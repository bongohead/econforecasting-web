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

/* forecasts.html */
class __TwigTemplate_516126d4db106904f981c8bc9205b8bb3032f166e46a74ff5450e97c1c67f9e4 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "forecasts.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 4
        echo "<meta name=\"description\" content=\"Forecasts page.\"/>
";
    }

    // line 7
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "<script src=\"https://code.highcharts.com/9.1/highcharts-more.js\"></script>
<!--<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>-->
<!--<script src=\"https://cdn.datatables.net/fixedcolumns/3.3.3/js/dataTables.fixedColumns.min.js\"></script>-->
";
    }

    // line 13
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 14
        echo "<div class=\"row gx-0\" style=\"background-color: var(--bs-efpaleblue)\">
\t";
        // line 15
        $this->loadTemplate("csm-sidebar.html", "forecasts.html", 15)->display($context);
        // line 16
        echo "\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-10 m-auto pt-2 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-auto\">
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t\t<!-- Card 1 -->
\t\t\t<div class=\"col-lg-6 border-0 p-0 pe-lg-4\">
\t\t\t\t<div class=\"card shadow\" data-ref-dispgroup=\"GDP\">
\t\t\t\t\t<div class=\"card-header\">
\t\t\t\t\t\t<div class=\"row flex-between-center\">
\t\t\t\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t\t\t\t<span class=\"mb-0 fw-bolder\" style=\"font-size:.9rem\">GDP</span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class=\"col-auto d-flex\">
\t\t\t\t\t\t\t\t<div class=\"input-group input-group-sm\">
\t\t\t\t\t\t\t\t  <label class=\"input-group-text\">Frequency</label>
\t\t\t\t\t\t\t\t\t<select class=\"form-select form-select-sm select-month me-2\">
\t\t\t\t\t\t\t\t\t\t<option value=\"q\">Quarterly</option><option value=\"m\" disabled>Monthly</option>
\t\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"m\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"q\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
            </div>
\t\t\t
\t\t\t<!-- Card 2 -->
\t\t\t<div class=\"col-lg-6 border-0 p-0 pe-lg-4\">
\t\t\t\t<div class=\"card shadow\" data-ref-dispgroup=\"Housing\">
\t\t\t\t\t<div class=\"card-header\">
\t\t\t\t\t\t<div class=\"row flex-between-center\">
\t\t\t\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t\t\t\t<span class=\"mb-0 fw-bolder\" style=\"font-size:.9rem\">Housing</span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class=\"col-auto d-flex\">
\t\t\t\t\t\t\t\t<div class=\"input-group input-group-sm\">
\t\t\t\t\t\t\t\t  <label class=\"input-group-text\">Frequency</label>
\t\t\t\t\t\t\t\t\t<select class=\"form-select form-select-sm select-month me-2\">
\t\t\t\t\t\t\t\t\t\t<option value=\"q\">Quarterly</option><option value=\"m\" >Monthly</option>
\t\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"m\" style=\"\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"q\" style=\"\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
            </div>

\t\t</div>
\t\t\t

\t\t
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "forecasts.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  77 => 16,  75 => 15,  72 => 14,  68 => 13,  61 => 8,  57 => 7,  52 => 4,  48 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}

{% block meta %}
<meta name=\"description\" content=\"Forecasts page.\"/>
{% endblock %}

{% block staticlinks %}
<script src=\"https://code.highcharts.com/9.1/highcharts-more.js\"></script>
<!--<script src=\"https://cdn.datatables.net/responsive/2.2.7/js/dataTables.responsive.min.js\"></script>-->
<!--<script src=\"https://cdn.datatables.net/fixedcolumns/3.3.3/js/dataTables.fixedColumns.min.js\"></script>-->
{% endblock %}

{% block content %}
<div class=\"row gx-0\" style=\"background-color: var(--bs-efpaleblue)\">
\t{% include 'csm-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-10 m-auto pt-2 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-auto\">
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t\t<!-- Card 1 -->
\t\t\t<div class=\"col-lg-6 border-0 p-0 pe-lg-4\">
\t\t\t\t<div class=\"card shadow\" data-ref-dispgroup=\"GDP\">
\t\t\t\t\t<div class=\"card-header\">
\t\t\t\t\t\t<div class=\"row flex-between-center\">
\t\t\t\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t\t\t\t<span class=\"mb-0 fw-bolder\" style=\"font-size:.9rem\">GDP</span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class=\"col-auto d-flex\">
\t\t\t\t\t\t\t\t<div class=\"input-group input-group-sm\">
\t\t\t\t\t\t\t\t  <label class=\"input-group-text\">Frequency</label>
\t\t\t\t\t\t\t\t\t<select class=\"form-select form-select-sm select-month me-2\">
\t\t\t\t\t\t\t\t\t\t<option value=\"q\">Quarterly</option><option value=\"m\" disabled>Monthly</option>
\t\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"m\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"q\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
            </div>
\t\t\t
\t\t\t<!-- Card 2 -->
\t\t\t<div class=\"col-lg-6 border-0 p-0 pe-lg-4\">
\t\t\t\t<div class=\"card shadow\" data-ref-dispgroup=\"Housing\">
\t\t\t\t\t<div class=\"card-header\">
\t\t\t\t\t\t<div class=\"row flex-between-center\">
\t\t\t\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t\t\t\t<span class=\"mb-0 fw-bolder\" style=\"font-size:.9rem\">Housing</span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class=\"col-auto d-flex\">
\t\t\t\t\t\t\t\t<div class=\"input-group input-group-sm\">
\t\t\t\t\t\t\t\t  <label class=\"input-group-text\">Frequency</label>
\t\t\t\t\t\t\t\t\t<select class=\"form-select form-select-sm select-month me-2\">
\t\t\t\t\t\t\t\t\t\t<option value=\"q\">Quarterly</option><option value=\"m\" >Monthly</option>
\t\t\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"m\" style=\"\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\" data-ref-freq=\"q\" style=\"\">
\t\t\t\t\t\t<div class=\"chart-container col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<div class=\"table-container\"></div>
\t\t\t\t\t\t<div class=\"card-footer bg-light p-0\" style=\"display:none\">
\t\t\t\t\t\t\t<a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\" style=\"font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;\">
\t\t\t\t\t\t\t\t<span class=\"align-middle pe-2\">Show Additional Variables</span><i class=\"bi bi-chevron-down\"></i>
\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
            </div>

\t\t</div>
\t\t\t

\t\t
\t</div>
</div>
{% endblock %}", "forecasts.html", "/var/www/econforecasting.com/public/templates/forecasts.html");
    }
}
