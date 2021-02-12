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

/* fc-rates-sidebar.html */
class __TwigTemplate_fe94217fbea5b7759b5c4ccabb147284f75f4d6efacd71ad19b5817e39c23c90 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<nav class=\"sidebar col-lg-auto d-none d-lg-block px-0 py-2 bg-light\" id=\"sidebar\"> <!-- Hide Sidebar for XS to M Devices -->
\t<div class=\"nav flex-column\">
\t\t<a href=\"#t\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span>Treasury Yield Forecast</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-1\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='t' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-info\">
\t\t\t\t<span class=\"fas fa-info-circle\"></span><span class=\"ps-2\">Overview and Methodology</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-tcurve\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Full Yield Curve</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-3m\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">3-Month T-Bill</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-6m\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">6-Month T-Bill</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-1y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">1-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-2y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">2-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-5y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">5-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-10y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">10-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-20y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">20-Year T-Bond</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-30y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">30-Year T-Bond</span>
\t\t\t</a>

\t\t</div>\t\t\t\t
\t\t
\t\t<a href=\"#ffr\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span>Other Interest Rates</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-1\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='ffr' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-ffr\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">Fed Funds Rate Forecast</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-sofr\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">SOFR Forecast</span>
\t\t\t</a>
\t\t</div>
\t\t
\t</div>
</nav>
";
    }

    public function getTemplateName()
    {
        return "fc-rates-sidebar.html";
    }

    public function getDebugInfo()
    {
        return array (  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<nav class=\"sidebar col-lg-auto d-none d-lg-block px-0 py-2 bg-light\" id=\"sidebar\"> <!-- Hide Sidebar for XS to M Devices -->
\t<div class=\"nav flex-column\">
\t\t<a href=\"#t\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span>Treasury Yield Forecast</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-1\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='t' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-info\">
\t\t\t\t<span class=\"fas fa-info-circle\"></span><span class=\"ps-2\">Overview and Methodology</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-tcurve\">
\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"ps-2\">Full Yield Curve</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-3m\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">3-Month T-Bill</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-6m\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">6-Month T-Bill</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-1y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">1-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-2y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">2-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-5y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">5-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-10y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">10-Year T-Note</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-20y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">20-Year T-Bond</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-t-30y\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">30-Year T-Bond</span>
\t\t\t</a>

\t\t</div>\t\t\t\t
\t\t
\t\t<a href=\"#ffr\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span>Other Interest Rates</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-1\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='ffr' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-ffr\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">Fed Funds Rate Forecast</span>
\t\t\t</a>
\t\t\t<a class=\"text-truncate\" href=\"/fc-rates-sofr\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">SOFR Forecast</span>
\t\t\t</a>
\t\t</div>
\t\t
\t</div>
</nav>
", "fc-rates-sidebar.html", "/var/www/econforecasting.com/public/templates/fc-rates-sidebar.html");
    }
}
