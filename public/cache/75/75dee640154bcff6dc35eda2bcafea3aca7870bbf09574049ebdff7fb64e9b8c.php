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

/* ac-sidebar.html */
class __TwigTemplate_33e6f4caac112b2e2d2aad661e5d10a5339da8ff4d7c4f9f7158f2a55c8e7e0e extends \Twig\Template
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
        echo "\t\t<nav class=\"sidebar col-md-3 col-lg-2 d-none d-md-block px-0 py-2\" id=\"sidebar\"> <!-- Hide Sidebar for XS and S Devices -->
\t\t\t<ul class=\"list-group\">
\t\t\t\t<!--
\t\t\t\t<a href=\"/accounts\" class=\"font-weight-bold list-group-item list-group-item-action flex-column bg-transparent\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-bank fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span>Cross-Asset Correlation</span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t-->
\t\t\t\t<a href=\"#cross-asset\" data-toggle=\"collapse\" class=\"nav-link\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-list fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span class=\"menu-collapsed\">Cross Asset Correlation</span>
\t\t\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t<div id='cross-asset' class=\"collapse show sidebar-submenu\">
\t\t\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"pl-2\">Index Data</span>
\t\t\t\t\t</a>
\t\t\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"pl-2\">Heatmap</span>
\t\t\t\t\t</a>
\t\t\t\t</div>\t\t\t\t
\t\t\t\t
\t\t\t\t<a href=\"#cross-region\" data-toggle=\"collapse\" class=\"nav-link\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fas fa-globe-americas fas-fw mr-3\"></span> 
\t\t\t\t\t\t<span class=\"menu-collapsed\">Cross Region Correlation</span>
\t\t\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t<div id='cross-region' class=\"collapse show sidebar-submenu\">
\t\t\t\t\t<a class=\"list-group-item list-group-item-action bg-none py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"pl-2\">Index Data</span>
\t\t\t\t\t</a>
\t\t\t\t\t<a class=\"list-group-item list-group-item-action bg-none py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"pl-2\">Heatmap</span>
\t\t\t\t\t</a>
\t\t\t\t</div>\t\t\t\t
\t\t\t\t<!--
\t\t\t\t<a href=\"/construction\" class=\"nav-link font-weight-bold list-group-item list-group-item-action flex-column align-items-start bg-transparent\">
\t\t\t\t\t<img height=\"14\" width=\"16\" class=\"mr-3\" src=\"https://img.icons8.com/ios-filled/50/000000/normal-distribution-histogram.png\">
\t\t\t\t\t<span>Monthly Budget</span>
\t\t\t\t</a>
\t\t\t\t-->
\t\t\t\t<!--
\t\t\t\t<a href=\"/error\" class=\"font-weight-bold list-group-item list-group-item-action flex-column bg-transparent\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-money fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span>Monthly Budget</span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t-->
\t\t\t\t<!--
\t\t\t\t<a href=\"/login\" class=\"font-weight-bold list-group-item list-group-item-action flex-column bg-transparent\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-power-off fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span>Log Out</span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t--->
\t\t\t</ul>
\t\t</nav>
";
    }

    public function getTemplateName()
    {
        return "ac-sidebar.html";
    }

    public function getDebugInfo()
    {
        return array (  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("\t\t<nav class=\"sidebar col-md-3 col-lg-2 d-none d-md-block px-0 py-2\" id=\"sidebar\"> <!-- Hide Sidebar for XS and S Devices -->
\t\t\t<ul class=\"list-group\">
\t\t\t\t<!--
\t\t\t\t<a href=\"/accounts\" class=\"font-weight-bold list-group-item list-group-item-action flex-column bg-transparent\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-bank fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span>Cross-Asset Correlation</span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t-->
\t\t\t\t<a href=\"#cross-asset\" data-toggle=\"collapse\" class=\"nav-link\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-list fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span class=\"menu-collapsed\">Cross Asset Correlation</span>
\t\t\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t<div id='cross-asset' class=\"collapse show sidebar-submenu\">
\t\t\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"pl-2\">Index Data</span>
\t\t\t\t\t</a>
\t\t\t\t\t<a class=\"list-group-item list-group-item-action py-1 text-truncate\" href=\"/ac-assets-hm\">
\t\t\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"pl-2\">Heatmap</span>
\t\t\t\t\t</a>
\t\t\t\t</div>\t\t\t\t
\t\t\t\t
\t\t\t\t<a href=\"#cross-region\" data-toggle=\"collapse\" class=\"nav-link\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fas fa-globe-americas fas-fw mr-3\"></span> 
\t\t\t\t\t\t<span class=\"menu-collapsed\">Cross Region Correlation</span>
\t\t\t\t\t\t<span class=\"fas fa-caret-down ml-auto\"></span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t<div id='cross-region' class=\"collapse show sidebar-submenu\">
\t\t\t\t\t<a class=\"list-group-item list-group-item-action bg-none py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t\t\t<span class=\"fas fa-chart-area\"></span><span class=\"pl-2\">Index Data</span>
\t\t\t\t\t</a>
\t\t\t\t\t<a class=\"list-group-item list-group-item-action bg-none py-1 text-truncate\" href=\"/ac-regions-hm\">
\t\t\t\t\t\t<span class=\"fas fa-table\"></span><span class=\"pl-2\">Heatmap</span>
\t\t\t\t\t</a>
\t\t\t\t</div>\t\t\t\t
\t\t\t\t<!--
\t\t\t\t<a href=\"/construction\" class=\"nav-link font-weight-bold list-group-item list-group-item-action flex-column align-items-start bg-transparent\">
\t\t\t\t\t<img height=\"14\" width=\"16\" class=\"mr-3\" src=\"https://img.icons8.com/ios-filled/50/000000/normal-distribution-histogram.png\">
\t\t\t\t\t<span>Monthly Budget</span>
\t\t\t\t</a>
\t\t\t\t-->
\t\t\t\t<!--
\t\t\t\t<a href=\"/error\" class=\"font-weight-bold list-group-item list-group-item-action flex-column bg-transparent\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-money fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span>Monthly Budget</span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t-->
\t\t\t\t<!--
\t\t\t\t<a href=\"/login\" class=\"font-weight-bold list-group-item list-group-item-action flex-column bg-transparent\">
\t\t\t\t\t<div class=\"d-flex w-100 justify-content-start align-items-center\">
\t\t\t\t\t\t<span class=\"fa fa-power-off fa-fw mr-3\"></span> 
\t\t\t\t\t\t<span>Log Out</span>
\t\t\t\t\t</div>
\t\t\t\t</a>
\t\t\t\t--->
\t\t\t</ul>
\t\t</nav>
", "ac-sidebar.html", "/var/www/econforecasting.com/public/templates/ac-sidebar.html");
    }
}
