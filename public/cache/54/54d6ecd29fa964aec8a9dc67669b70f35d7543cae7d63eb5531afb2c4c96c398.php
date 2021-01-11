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

/* accounts.html */
class __TwigTemplate_dfd310497f23c0a0ea0f15fd116697b102bf15b2def09a98cfd83a5a5fade708 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "accounts.html", 1);
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
\t<h1 class=\"text-center\">Net Worth & Account Balances</h1>
\t<h3 class=\"text-center\">Net Worth: <span class=\"text-success\" id=\"net-worth\"></span></h3>
    <section class=\"container\">
\t\t\t<div class=\"row justify-content-center my-3\">
\t\t\t\t\t<div class=\"col-md-12 w-100\" id=\"accounts-chart-div\">
\t\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row justify-content-center my-2\">
\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t<table class=\"border-bottom\" id=\"accounts-table\"></table>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row justify-content-center my-4\">
\t\t\t\t<div class=\"col-6\">
\t\t\t\t\t<button type=\"button\" id=\"add-account-open\" class=\"btn btn-success btn-md btn-block\">Click to Add a New Account</button>
\t\t\t\t</div>
\t\t\t</div>

    </section>

\t\t
\t\t
\t\t<!-- Edit Account Modal -->
\t\t<div class=\"modal fade\" id=\"edit-account-modal\" tabindex=\"-1\" role=\"dialog\">
\t\t\t<div class=\"modal-dialog modal-dialog-centered\" role=\"document\">
\t\t\t\t<div class=\"modal-content\">
\t\t\t\t\t<form class=\"form\">
\t\t\t\t\t\t<div class=\"modal-header\">
\t\t\t\t\t\t\t<h5 class=\"modal-title\">Edit Account Information</h5>
\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-body\">
\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">ID:</span></div>
\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"edit-account-id\" placeholder=\"1\" disabled>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Account Name:</span></div>
\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"edit-account-name\" placeholder=\"Account Name\">
\t\t\t\t\t\t\t</div>


\t\t\t\t\t\t\t<div class = \"input-group input-group-md\">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Parent Account:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md\" id=\"edit-account-parent-id\"></select>
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Order:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md col-2\" id=\"edit-account-rel-order\"></select>

\t\t\t\t\t\t\t</div>
\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Debit Effect on Balance:<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\"></span></span></div>
\t\t\t\t\t\t\t\t<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\" id=\"edit-account-debit-effect\">
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-info btn-md active\"><input type=\"radio\" value=\"1\" name=\"edit-account-debit-effect\" autocomplete=\"off\">Increases Balance</label>
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-info btn-md\"><input type=\"radio\" value=\"-1\" name=\"edit-account-debit-effect\" autocomplete=\"off\">Decreases Balance</label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<input id=\"edit-account-is-open\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-on=\"Account is Open to New transactions\" data-off=\"Account is Closed to New Transactions\" data-width=\"100%\" data-size=\"sm\" data-style=\"mt-3\" data-onstyle=\"success\" data-offstyle=\"danger\">

\t\t\t\t\t\t\t<div class=\"invalid-feedback mt-1\" style=\"color: #DC3545, font-size: .8rem\">Error Message!</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-footer\">
\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
\t\t\t\t\t\t\t<button class=\"btn btn-primary\" id=\"edit-account-submit\" type=\"button\">Submit</button>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t
\t\t
\t\t<!-- Add Account Modal -->
\t\t<div class=\"modal fade\" id=\"add-account-modal\" tabindex=\"-1\" role=\"dialog\">
\t\t\t<div class=\"modal-dialog modal-dialog-centered\" role=\"document\">
\t\t\t\t<div class=\"modal-content\">
\t\t\t\t\t<form class=\"form\">
\t\t\t\t\t\t<div class=\"modal-header\">
\t\t\t\t\t\t\t<h5 class=\"modal-title\">New Account Information</h5>
\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-body\">
\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Account Name:</span></div>
\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"add-account-name\" placeholder=\"Enter Account Name Here\">
\t\t\t\t\t\t\t</div>

\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Parent Account:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md\" id=\"add-account-parent-id\"></select>
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Order:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md col-2\" id=\"add-account-rel-order\"></select>
\t\t\t\t\t\t\t</div>

\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Debit Effect on Balance:<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\"></span></span></div>
\t\t\t\t\t\t\t\t<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\" id=\"add-account-debit-effect\">
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-secondary btn-md\"><input type=\"radio\" value=\"1\" autocomplete=\"off\">Increases Balance</label>
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-secondary btn-md\"><input type=\"radio\" value=\"-1\" autocomplete=\"off\">Decreases Balance</label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class=\"invalid-feedback mt-1\" style=\"color: #DC3545, font-size: .8rem\">Error Message!</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-footer\">
\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
\t\t\t\t\t\t\t<button class=\"btn btn-primary\" id=\"add-account-submit\" type=\"button\">Submit</button>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>


";
    }

    public function getTemplateName()
    {
        return "accounts.html";
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

\t<h1 class=\"text-center\">Net Worth & Account Balances</h1>
\t<h3 class=\"text-center\">Net Worth: <span class=\"text-success\" id=\"net-worth\"></span></h3>
    <section class=\"container\">
\t\t\t<div class=\"row justify-content-center my-3\">
\t\t\t\t\t<div class=\"col-md-12 w-100\" id=\"accounts-chart-div\">
\t\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row justify-content-center my-2\">
\t\t\t\t<div class=\"col-auto\">
\t\t\t\t\t<table class=\"border-bottom\" id=\"accounts-table\"></table>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"row justify-content-center my-4\">
\t\t\t\t<div class=\"col-6\">
\t\t\t\t\t<button type=\"button\" id=\"add-account-open\" class=\"btn btn-success btn-md btn-block\">Click to Add a New Account</button>
\t\t\t\t</div>
\t\t\t</div>

    </section>

\t\t
\t\t
\t\t<!-- Edit Account Modal -->
\t\t<div class=\"modal fade\" id=\"edit-account-modal\" tabindex=\"-1\" role=\"dialog\">
\t\t\t<div class=\"modal-dialog modal-dialog-centered\" role=\"document\">
\t\t\t\t<div class=\"modal-content\">
\t\t\t\t\t<form class=\"form\">
\t\t\t\t\t\t<div class=\"modal-header\">
\t\t\t\t\t\t\t<h5 class=\"modal-title\">Edit Account Information</h5>
\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-body\">
\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">ID:</span></div>
\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"edit-account-id\" placeholder=\"1\" disabled>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Account Name:</span></div>
\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"edit-account-name\" placeholder=\"Account Name\">
\t\t\t\t\t\t\t</div>


\t\t\t\t\t\t\t<div class = \"input-group input-group-md\">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Parent Account:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md\" id=\"edit-account-parent-id\"></select>
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Order:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md col-2\" id=\"edit-account-rel-order\"></select>

\t\t\t\t\t\t\t</div>
\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Debit Effect on Balance:<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\"></span></span></div>
\t\t\t\t\t\t\t\t<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\" id=\"edit-account-debit-effect\">
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-info btn-md active\"><input type=\"radio\" value=\"1\" name=\"edit-account-debit-effect\" autocomplete=\"off\">Increases Balance</label>
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-info btn-md\"><input type=\"radio\" value=\"-1\" name=\"edit-account-debit-effect\" autocomplete=\"off\">Decreases Balance</label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<input id=\"edit-account-is-open\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-on=\"Account is Open to New transactions\" data-off=\"Account is Closed to New Transactions\" data-width=\"100%\" data-size=\"sm\" data-style=\"mt-3\" data-onstyle=\"success\" data-offstyle=\"danger\">

\t\t\t\t\t\t\t<div class=\"invalid-feedback mt-1\" style=\"color: #DC3545, font-size: .8rem\">Error Message!</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-footer\">
\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
\t\t\t\t\t\t\t<button class=\"btn btn-primary\" id=\"edit-account-submit\" type=\"button\">Submit</button>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t
\t\t
\t\t<!-- Add Account Modal -->
\t\t<div class=\"modal fade\" id=\"add-account-modal\" tabindex=\"-1\" role=\"dialog\">
\t\t\t<div class=\"modal-dialog modal-dialog-centered\" role=\"document\">
\t\t\t\t<div class=\"modal-content\">
\t\t\t\t\t<form class=\"form\">
\t\t\t\t\t\t<div class=\"modal-header\">
\t\t\t\t\t\t\t<h5 class=\"modal-title\">New Account Information</h5>
\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-body\">
\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Account Name:</span></div>
\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control form-control-md\" id=\"add-account-name\" placeholder=\"Enter Account Name Here\">
\t\t\t\t\t\t\t</div>

\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Parent Account:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md\" id=\"add-account-parent-id\"></select>
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Order:</span></div>
\t\t\t\t\t\t\t\t<select class=\"form-control form-control-md col-2\" id=\"add-account-rel-order\"></select>
\t\t\t\t\t\t\t</div>

\t
\t\t\t\t\t\t\t<div class = \"input-group input-group-md \">
\t\t\t\t\t\t\t\t<div class=\"input-group-prepend\"><span class=\"input-group-text\">Debit Effect on Balance:<span class=\"fa fa-question-circle fa-fw ml-1 mr-1\"></span></span></div>
\t\t\t\t\t\t\t\t<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\" id=\"add-account-debit-effect\">
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-secondary btn-md\"><input type=\"radio\" value=\"1\" autocomplete=\"off\">Increases Balance</label>
\t\t\t\t\t\t\t\t\t<label class=\"btn btn-secondary btn-md\"><input type=\"radio\" value=\"-1\" autocomplete=\"off\">Decreases Balance</label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t
\t\t\t\t\t\t\t<div class=\"invalid-feedback mt-1\" style=\"color: #DC3545, font-size: .8rem\">Error Message!</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class=\"modal-footer\">
\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>
\t\t\t\t\t\t\t<button class=\"btn btn-primary\" id=\"add-account-submit\" type=\"button\">Submit</button>
\t\t\t\t\t\t</div>
\t\t\t\t\t</form>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>


{% endblock %}", "accounts.html", "/var/www/econforecasting.com/public/templates/accounts.html");
    }
}
