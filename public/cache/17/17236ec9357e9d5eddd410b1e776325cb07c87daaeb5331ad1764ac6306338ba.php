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

/* transactions.html */
class __TwigTemplate_c3e70db9eb9b6cf5d9519631f227970813d58d91affc98cf547457b908c2db98 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "transactions.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 6
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 7
        echo "
<section class=\"container-fluid\">
\t<div class=\"col-12 mb-2 bs-callout bs-callout-primary\" style=\"background-color: rgb(245, 255, 255)\">
\t\t<h2><span id=\"account-name\">Account</span>: <span id=\"account-balance\" class=\"text-success\"></span></h2>
\t\t
\t\t<div class=\"row justify-content-center my-1\">
\t\t\t<div class=\"col-lg-4 col-md-12\" >
\t\t\t\t<h4>Account Details</h4>
\t\t\t</div>
\t\t\t<div class=\"col-lg-8 col-md-12 col-md-12\" id=\"transactions-chart-div\">
\t\t\t</div>
\t\t\t
\t\t</div>
\t<div class=\"row justify-content-center my-2\">
\t\t<div class=\"col-sm-12 col-md-10 col-lg-8\">
\t\t\t<table class=\"table\" style=\"width:100%\" id=\"transactions-table\"></table>
\t\t</div>
\t</div>

\t</div>

\t<!--
\t<div class=\"row justify-content-center my-2\">
\t\t<div class=\"col-auto my-2\">
\t\t\t<table class=\"table table-responsive\" style=\"\" id=\"transactions-table\"></table>
\t\t</div>
\t</div>
\t-->
</section>

<!-- Add Edit Modal -->
<div class=\"modal fade\" id=\"edit-transaction-modal\" tabindex=\"-1\" role=\"dialog\">
\t<div class=\"modal-dialog modal-md modal-dialog-centered\" role=\"document\">
\t\t<div class=\"modal-content\">
\t\t\t<form class=\"form\">
\t\t\t\t<div class=\"modal-header\">
\t\t\t\t\t<h5 class=\"modal-title\">Edit Transaction</h5>
\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>
\t\t\t\t</div>
\t\t\t\t<div class=\"modal-body\">
\t\t\t\t
\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Transaction #:</span></div>
\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md disabled col-2\" id=\"edit-transaction-id\" readonly>
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Transaction Date:</span></div>
\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"edit-transaction-date\">
\t\t\t\t\t</div>

\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Description:</span></div>
\t\t\t\t\t\t<input type=\"text\"  class=\"form-control form-control-md\" id=\"edit-transaction-description\"></input>
\t\t\t\t\t</div>

\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Funds In/Out
\t\t\t\t\t\t\t<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\" data-toggle=\"tooltip\" data-html=\"true\" title=\"Enter the dollar value of the funds entering this account; use negatives to represent funds exiting the account.\"></span>:
\t\t\t\t\t\t</span></div>
\t\t\t\t\t\t<input type=\"text\"  class=\"form-control form-control-md\" id=\"edit-transaction-value\"></input>
\t\t\t\t\t</div>


\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Fund Source/Destination
\t\t\t\t\t\t\t<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\" data-toggle=\"tooltip\" data-html=\"true\" title=\"Source of funds entering account; or destination of funds exiting account if funds in/out value is negative.\"></span>:
\t\t\t\t\t\t</span></div>
\t\t\t\t\t\t<select id=\"edit-transaction-other-account\" class=\"form-control form-control-md\">
\t\t\t\t\t\t</select>
\t\t\t\t\t</div>
\t\t\t\t\t
\t\t\t\t\t<p id=\"edit-transaction-debit-statement\" style=\"color: #DC3545, font-size: .8rem\"></p>

\t\t\t\t\t<div class=\"invalid-feedback mt-1\" style=\"color: #DC3545, font-size: .8rem\">Error Message!</div>
\t\t\t\t</div>
\t\t\t\t<div class=\"modal-footer\">
\t\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
\t\t\t\t\t<button class=\"btn btn-danger\" id=\"edit-transaction-delete\" type=\"button\">Delete Transaction</button>
\t\t\t\t\t<button class=\"btn btn-success\" id=\"edit-transaction-submit\" type=\"button\">Submit Changes</button>
\t\t\t\t</div>
\t\t\t</form>
\t\t</div>
\t</div>
</div>

";
    }

    public function getTemplateName()
    {
        return "transactions.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  57 => 7,  53 => 6,  47 => 2,  36 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}
{% block staticlinks %}
{% endblock %}


{% block content %}

<section class=\"container-fluid\">
\t<div class=\"col-12 mb-2 bs-callout bs-callout-primary\" style=\"background-color: rgb(245, 255, 255)\">
\t\t<h2><span id=\"account-name\">Account</span>: <span id=\"account-balance\" class=\"text-success\"></span></h2>
\t\t
\t\t<div class=\"row justify-content-center my-1\">
\t\t\t<div class=\"col-lg-4 col-md-12\" >
\t\t\t\t<h4>Account Details</h4>
\t\t\t</div>
\t\t\t<div class=\"col-lg-8 col-md-12 col-md-12\" id=\"transactions-chart-div\">
\t\t\t</div>
\t\t\t
\t\t</div>
\t<div class=\"row justify-content-center my-2\">
\t\t<div class=\"col-sm-12 col-md-10 col-lg-8\">
\t\t\t<table class=\"table\" style=\"width:100%\" id=\"transactions-table\"></table>
\t\t</div>
\t</div>

\t</div>

\t<!--
\t<div class=\"row justify-content-center my-2\">
\t\t<div class=\"col-auto my-2\">
\t\t\t<table class=\"table table-responsive\" style=\"\" id=\"transactions-table\"></table>
\t\t</div>
\t</div>
\t-->
</section>

<!-- Add Edit Modal -->
<div class=\"modal fade\" id=\"edit-transaction-modal\" tabindex=\"-1\" role=\"dialog\">
\t<div class=\"modal-dialog modal-md modal-dialog-centered\" role=\"document\">
\t\t<div class=\"modal-content\">
\t\t\t<form class=\"form\">
\t\t\t\t<div class=\"modal-header\">
\t\t\t\t\t<h5 class=\"modal-title\">Edit Transaction</h5>
\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>
\t\t\t\t</div>
\t\t\t\t<div class=\"modal-body\">
\t\t\t\t
\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Transaction #:</span></div>
\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md disabled col-2\" id=\"edit-transaction-id\" readonly>
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Transaction Date:</span></div>
\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"edit-transaction-date\">
\t\t\t\t\t</div>

\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Description:</span></div>
\t\t\t\t\t\t<input type=\"text\"  class=\"form-control form-control-md\" id=\"edit-transaction-description\"></input>
\t\t\t\t\t</div>

\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Funds In/Out
\t\t\t\t\t\t\t<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\" data-toggle=\"tooltip\" data-html=\"true\" title=\"Enter the dollar value of the funds entering this account; use negatives to represent funds exiting the account.\"></span>:
\t\t\t\t\t\t</span></div>
\t\t\t\t\t\t<input type=\"text\"  class=\"form-control form-control-md\" id=\"edit-transaction-value\"></input>
\t\t\t\t\t</div>


\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Fund Source/Destination
\t\t\t\t\t\t\t<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\" data-toggle=\"tooltip\" data-html=\"true\" title=\"Source of funds entering account; or destination of funds exiting account if funds in/out value is negative.\"></span>:
\t\t\t\t\t\t</span></div>
\t\t\t\t\t\t<select id=\"edit-transaction-other-account\" class=\"form-control form-control-md\">
\t\t\t\t\t\t</select>
\t\t\t\t\t</div>
\t\t\t\t\t
\t\t\t\t\t<p id=\"edit-transaction-debit-statement\" style=\"color: #DC3545, font-size: .8rem\"></p>

\t\t\t\t\t<div class=\"invalid-feedback mt-1\" style=\"color: #DC3545, font-size: .8rem\">Error Message!</div>
\t\t\t\t</div>
\t\t\t\t<div class=\"modal-footer\">
\t\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
\t\t\t\t\t<button class=\"btn btn-danger\" id=\"edit-transaction-delete\" type=\"button\">Delete Transaction</button>
\t\t\t\t\t<button class=\"btn btn-success\" id=\"edit-transaction-submit\" type=\"button\">Submit Changes</button>
\t\t\t\t</div>
\t\t\t</form>
\t\t</div>
\t</div>
</div>

{% endblock %}
", "transactions.html", "/var/www/econforecasting.com/public/templates/transactions.html");
    }
}
