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

/* fc-macro-sidebar.html */
class __TwigTemplate_ef1689252c4de6f7259619bdcc65b3648a4b23e4ed3661582765551746b7a9bd extends \Twig\Template
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
\t\t
\t\t<a href=\"#inflation\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span>Inflation Forecast</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-1\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='inflation' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/fc-macro-inf\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">CPI Inflation Forecast</span>
\t\t\t</a>
\t\t</div>


\t</div>
</nav>
";
    }

    public function getTemplateName()
    {
        return "fc-macro-sidebar.html";
    }

    public function getDebugInfo()
    {
        return array (  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<nav class=\"sidebar col-lg-auto d-none d-lg-block px-0 py-2 bg-light\" id=\"sidebar\"> <!-- Hide Sidebar for XS to M Devices -->
\t<div class=\"nav flex-column\">
\t\t
\t\t<a href=\"#inflation\" data-bs-toggle=\"collapse\" class=\"nav-link\">
\t\t\t<div>
\t\t\t\t<span>Inflation Forecast</span>
\t\t\t\t<span class=\"fas fa-caret-down ms-1\"></span>
\t\t\t</div>
\t\t</a>
\t\t<div id='inflation' class=\"collapse show sidebar-submenu\">
\t\t\t<a class=\"text-truncate\" href=\"/fc-macro-inf\">
\t\t\t\t<span class=\"fas fa-chart-line\"></span><span class=\"ps-2\">CPI Inflation Forecast</span>
\t\t\t</a>
\t\t</div>


\t</div>
</nav>
", "fc-macro-sidebar.html", "/var/www/econforecasting.com/public/templates/fc-macro-sidebar.html");
    }
}
