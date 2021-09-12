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
<script src=\"https://cdn.datatables.net/fixedcolumns/3.3.3/js/dataTables.fixedColumns.min.js\"></script>
";
    }

    // line 13
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 14
        echo "<div class=\"row gx-0 bg-econlpale\">
\t";
        // line 15
        $this->loadTemplate("fc-rates-sidebar.html", "forecasts.html", 15)->display($context);
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
\t\t\t<div class=\"col-lg-6 border-0 p-0\">
\t\t\t\t<div class=\"card shadow\">
\t\t\t\t\t<div class=\"card-header\">
\t\t\t\t\t\t<div class=\"row flex-between-center\">
\t\t\t\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t\t\t\t<h6 class=\"mb-0\">Total Sales</h6>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class=\"col-auto d-flex\"><select class=\"form-select form-select-sm select-month me-2\">
\t\t\t\t\t\t\t\t<option value=\"0\">January</option>
\t\t\t\t\t\t\t\t<option value=\"1\">February</option>
\t\t\t\t\t\t\t\t<option value=\"2\">March</option>
\t\t\t\t\t\t\t\t<option value=\"3\">April</option>
\t\t\t\t\t\t\t\t<option value=\"4\">May</option>
\t\t\t\t\t\t\t\t<option value=\"5\">Jun</option>
\t\t\t\t\t\t\t\t<option value=\"6\">July</option>
\t\t\t\t\t\t\t\t<option value=\"7\">August</option>
\t\t\t\t\t\t\t\t<option value=\"8\">September</option>
\t\t\t\t\t\t\t\t<option value=\"9\">October</option>
\t\t\t\t\t\t\t\t<option value=\"10\">November</option>
\t\t\t\t\t\t\t\t<option value=\"11\">December</option>
\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\">
\t\t\t\t\t\t<div id=\"gdp-chart\" class=\"col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<table class=\"table summary-table w-100\" id=\"gdp-table\"></table>
\t\t\t\t\t</div>
\t\t\t\t\t
\t\t\t\t</div>
            </div>
\t\t\t<!-- Card 2 -->
\t\t\t<div class=\"col-lg-6 pe-lg-2 mb-3\">
              <div class=\"card h-lg-100 overflow-hidden\">
                <div class=\"card-header bg-light\">
                  <div class=\"row align-items-center\">
                    <div class=\"col\">
                      <h6 class=\"mb-0\">Running Projects</h6>
                    </div>
                    <div class=\"col-auto text-center pe-card\"><select class=\"form-select form-select-sm\">
                        <option>Working Time</option>
                        <option>Estimated Time</option>
                        <option>Billable Time</option>
                      </select></div>
                  </div>
                </div>
                <div class=\"card-body p-0\">
                  <div class=\"row g-0 align-items-center py-2 position-relative border-bottom border-200\">
                    <div class=\"col ps-card py-1 position-static\">
                      <div class=\"d-flex align-items-center\">
                        <div class=\"avatar avatar-xl me-3\">
                          <div class=\"avatar-name rounded-circle bg-soft-success text-dark\"><span class=\"fs-0 text-success\">R</span></div>
                        </div>
                        <div class=\"flex-1\">
                          <h6 class=\"mb-0 d-flex align-items-center\"><a class=\"text-800 stretched-link\" href=\"#!\">Reign</a><span class=\"badge rounded-pill ms-2 bg-200 text-primary\">79%</span></h6>
                        </div>
                      </div>
                    </div>
                    <div class=\"col py-1\">
                      <div class=\"row flex-end-center g-0\">
                        <div class=\"col-auto pe-2\">
                          <div class=\"fs--1 fw-semi-bold\">25:20:00</div>
                        </div>
                        <div class=\"col-5 pe-card ps-2\">
                          <div class=\"progress bg-200 me-2\" style=\"height: 5px;\">
                            <div class=\"progress-bar rounded-pill\" role=\"progressbar\" style=\"width: 79%\" aria-valuenow=\"79\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=\"row g-0 align-items-center py-2 position-relative\">
                    <div class=\"col ps-card py-1 position-static\">
                      <div class=\"d-flex align-items-center\">
                        <div class=\"avatar avatar-xl me-3\">
                          <div class=\"avatar-name rounded-circle bg-soft-danger text-dark\"><span class=\"fs-0 text-danger\">S</span></div>
                        </div>
                        <div class=\"flex-1\">
                          <h6 class=\"mb-0 d-flex align-items-center\"><a class=\"text-800 stretched-link\" href=\"#!\">Slick</a><span class=\"badge rounded-pill ms-2 bg-200 text-primary\">70%</span></h6>
                        </div>
                      </div>
                    </div>
                    <div class=\"col py-1\">
                      <div class=\"row flex-end-center g-0\">
                        <div class=\"col-auto pe-2\">
                          <div class=\"fs--1 fw-semi-bold\">31:20:00</div>
                        </div>
                        <div class=\"col-5 pe-card ps-2\">
                          <div class=\"progress bg-200 me-2\" style=\"height: 5px;\">
                            <div class=\"progress-bar rounded-pill\" role=\"progressbar\" style=\"width: 70%\" aria-valuenow=\"70\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class=\"card-footer bg-light p-0\"><a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\">Show all projects<svg class=\"svg-inline--fa fa-chevron-right fa-w-10 ms-1 fs--2\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"chevron-right\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\" data-fa-i2svg=\"\"><path fill=\"currentColor\" d=\"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z\"></path></svg><!-- <span class=\"fas fa-chevron-right ms-1 fs--2\"></span> Font Awesome fontawesome.com --></a></div>
              </div>
            </div>\t\t

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
<script src=\"https://cdn.datatables.net/fixedcolumns/3.3.3/js/dataTables.fixedColumns.min.js\"></script>
{% endblock %}

{% block content %}
<div class=\"row gx-0 bg-econlpale\">
\t{% include 'fc-rates-sidebar.html' %}
\t<div class=\"col-12 col-lg-8 col-xl-9 col-xxl-10 m-auto pt-2 px-2 pb-5\">
\t
\t\t<div class=\"row justify-content-center px-3\" style=\"background-color:rgba(25, 50, 20, 0.1)\">
\t\t\t<div id=\"chart-container\" class=\"col-auto\">
\t\t\t</div>
\t\t</div>
\t\t
\t\t<div class=\"row justify-content-center pt-3 px-3\">
\t\t\t<!-- Card 1 -->
\t\t\t<div class=\"col-lg-6 border-0 p-0\">
\t\t\t\t<div class=\"card shadow\">
\t\t\t\t\t<div class=\"card-header\">
\t\t\t\t\t\t<div class=\"row flex-between-center\">
\t\t\t\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t\t\t\t<h6 class=\"mb-0\">Total Sales</h6>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class=\"col-auto d-flex\"><select class=\"form-select form-select-sm select-month me-2\">
\t\t\t\t\t\t\t\t<option value=\"0\">January</option>
\t\t\t\t\t\t\t\t<option value=\"1\">February</option>
\t\t\t\t\t\t\t\t<option value=\"2\">March</option>
\t\t\t\t\t\t\t\t<option value=\"3\">April</option>
\t\t\t\t\t\t\t\t<option value=\"4\">May</option>
\t\t\t\t\t\t\t\t<option value=\"5\">Jun</option>
\t\t\t\t\t\t\t\t<option value=\"6\">July</option>
\t\t\t\t\t\t\t\t<option value=\"7\">August</option>
\t\t\t\t\t\t\t\t<option value=\"8\">September</option>
\t\t\t\t\t\t\t\t<option value=\"9\">October</option>
\t\t\t\t\t\t\t\t<option value=\"10\">November</option>
\t\t\t\t\t\t\t\t<option value=\"11\">December</option>
\t\t\t\t\t\t\t</select>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"card-body h-100\">
\t\t\t\t\t\t<div id=\"gdp-chart\" class=\"col-xl-9 col-lg-10 col-12-md\"></div>
\t\t\t\t\t\t<table class=\"table summary-table w-100\" id=\"gdp-table\"></table>
\t\t\t\t\t</div>
\t\t\t\t\t
\t\t\t\t</div>
            </div>
\t\t\t<!-- Card 2 -->
\t\t\t<div class=\"col-lg-6 pe-lg-2 mb-3\">
              <div class=\"card h-lg-100 overflow-hidden\">
                <div class=\"card-header bg-light\">
                  <div class=\"row align-items-center\">
                    <div class=\"col\">
                      <h6 class=\"mb-0\">Running Projects</h6>
                    </div>
                    <div class=\"col-auto text-center pe-card\"><select class=\"form-select form-select-sm\">
                        <option>Working Time</option>
                        <option>Estimated Time</option>
                        <option>Billable Time</option>
                      </select></div>
                  </div>
                </div>
                <div class=\"card-body p-0\">
                  <div class=\"row g-0 align-items-center py-2 position-relative border-bottom border-200\">
                    <div class=\"col ps-card py-1 position-static\">
                      <div class=\"d-flex align-items-center\">
                        <div class=\"avatar avatar-xl me-3\">
                          <div class=\"avatar-name rounded-circle bg-soft-success text-dark\"><span class=\"fs-0 text-success\">R</span></div>
                        </div>
                        <div class=\"flex-1\">
                          <h6 class=\"mb-0 d-flex align-items-center\"><a class=\"text-800 stretched-link\" href=\"#!\">Reign</a><span class=\"badge rounded-pill ms-2 bg-200 text-primary\">79%</span></h6>
                        </div>
                      </div>
                    </div>
                    <div class=\"col py-1\">
                      <div class=\"row flex-end-center g-0\">
                        <div class=\"col-auto pe-2\">
                          <div class=\"fs--1 fw-semi-bold\">25:20:00</div>
                        </div>
                        <div class=\"col-5 pe-card ps-2\">
                          <div class=\"progress bg-200 me-2\" style=\"height: 5px;\">
                            <div class=\"progress-bar rounded-pill\" role=\"progressbar\" style=\"width: 79%\" aria-valuenow=\"79\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=\"row g-0 align-items-center py-2 position-relative\">
                    <div class=\"col ps-card py-1 position-static\">
                      <div class=\"d-flex align-items-center\">
                        <div class=\"avatar avatar-xl me-3\">
                          <div class=\"avatar-name rounded-circle bg-soft-danger text-dark\"><span class=\"fs-0 text-danger\">S</span></div>
                        </div>
                        <div class=\"flex-1\">
                          <h6 class=\"mb-0 d-flex align-items-center\"><a class=\"text-800 stretched-link\" href=\"#!\">Slick</a><span class=\"badge rounded-pill ms-2 bg-200 text-primary\">70%</span></h6>
                        </div>
                      </div>
                    </div>
                    <div class=\"col py-1\">
                      <div class=\"row flex-end-center g-0\">
                        <div class=\"col-auto pe-2\">
                          <div class=\"fs--1 fw-semi-bold\">31:20:00</div>
                        </div>
                        <div class=\"col-5 pe-card ps-2\">
                          <div class=\"progress bg-200 me-2\" style=\"height: 5px;\">
                            <div class=\"progress-bar rounded-pill\" role=\"progressbar\" style=\"width: 70%\" aria-valuenow=\"70\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class=\"card-footer bg-light p-0\"><a class=\"btn btn-sm btn-link d-block w-100 py-2\" href=\"#!\">Show all projects<svg class=\"svg-inline--fa fa-chevron-right fa-w-10 ms-1 fs--2\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"chevron-right\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\" data-fa-i2svg=\"\"><path fill=\"currentColor\" d=\"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z\"></path></svg><!-- <span class=\"fas fa-chevron-right ms-1 fs--2\"></span> Font Awesome fontawesome.com --></a></div>
              </div>
            </div>\t\t

\t\t
\t</div>
</div>
{% endblock %}", "forecasts.html", "/var/www/econforecasting.com/public/templates/forecasts.html");
    }
}
