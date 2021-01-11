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

/* login.html */
class __TwigTemplate_07ee63bc4d96b6ea8261133348d621bae0e9409693ae1879fd8e2798e39c4011 extends \Twig\Template
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
        echo "<!DOCTYPE html>
<html lang=\"en-US\">

<head>
    <meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">

    <title>";
        // line 8
        echo twig_escape_filter($this->env, ($context["title"] ?? null));
        echo "</title>
    <link rel=\"icon\" type=image/ico href=\"/static/favicon2.png\"/>
    <meta name=description content=\"Content.\" />
    <meta name=keywords content=\"keyword1 keyword2 keyword3 keyword4\" />
    
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
\t<link rel=\"stylesheet\" type=\"text/css\" href=\"//stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">
\t<link rel=\"stylesheet\" type=\"text/css\" href=\"//stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\">

\t<link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css\"/> 

\t<script src=\"//code.jquery.com/jquery-3.4.1.min.js\" integrity=\"sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=\" crossorigin=\"anonymous\"></script>

\t<script src=\"//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\" integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\" crossorigin=\"anonymous\"></script>
\t<script src=\"//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\" integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\" crossorigin=\"anonymous\"></script>

    ";
        // line 25
        echo ($context["pageJS"] ?? null);
        echo "

</head>

<body>
\t<header>
\t\t<div class=\"container-fluid\" style=\"height:.25rem;background-color:rgba(10, 24, 66,1);\"></div>        
\t\t<nav class=\"navbar navbar-expand-md navbar-dark sticky-top\">
\t\t\t<a class=\"navbar-brand\" href=\"/\">Budget Log</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>
\t\t\t
\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t<ul class=\"navbar-nav\">
\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/\">Work In Progress</a>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\">Work in Progress</a>
\t\t\t\t\t</li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t</nav>
\t</header>


   <div class=\"container-fluid\">
\t\t<div class=\"row\">
\t\t\t<!-- Form from https://getbootstrap.com/docs/4.0/examples/sign-in/ -->
\t\t\t<form class=\"text-center\" style=\"max-width:330px;padding:15px;margin:0 auto\">
\t\t\t\t<img class=\"mb-4\" src=\"/static/slug.png\" alt=\"\" width=\"150\" height=\"150\">
\t\t\t\t<h1 class=\"h3 mb-3 font-weight-normal\">Please sign in</h1>
\t\t\t\t\t<label for=\"inputEmail\" class=\"sr-only\">Email address</label>
\t\t\t\t\t<input type=\"email\" id=\"inputEmail\" class=\"form-control mb-2 py-4 px-2\" placeholder=\"Email address\" required=\"\" autofocus=\"\">
\t\t\t\t\t<label for=\"inputPassword\" class=\"sr-only\">Password</label>
\t\t\t\t\t<input type=\"password\" id=\"inputPassword\" class=\"form-control mb-2 py-4 px-2\" placeholder=\"Password\" required=\"\">
\t\t\t\t\t<div class=\"checkbox mb-2\">
\t\t\t\t\t\t<label>
\t\t\t\t\t\t\t<input type=\"checkbox\" value=\"remember-me\"> Remember me
\t\t\t\t\t\t</label>
\t\t\t\t\t</div>
\t\t\t\t\t<button id=\"login-button\" class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Sign in</button>
\t\t\t\t</form>
\t\t</div>
\t</div>
\t
\t<div class=\"row flex-xl-nowrap\">
\t\t<div class=\"col-12 font-small pt-4\" style=\"background: rgba(10, 24, 66,1);\">
\t\t\t<div class=\"row\">
\t
\t\t\t\t<div class=\"col-md-6 mt-md-0 mt-3\">
\t\t\t\t\t<h5 class=\"text-uppercase\">CHIMPS v5.2</h5>
\t\t\t\t\t<p>Under development</p>
\t\t\t\t</div>\t\t
\t\t\t\t<div class=\"col-md-6 mb-md-0 mb-3\">
\t\t\t\t\t<h5 class=\"text-uppercase\">Links</h5>
\t\t\t\t\t<ul class=\"list-unstyled\">
\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t<a href=\"#!\">Link 1</a>
\t\t\t\t\t\t</li>
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t</div>

\t\t\t<div class=\"footer-copyright text-center\">© 2019
\t\t\t\t<a href=\"test\">Email</a>
\t\t\t</div>\t\t\t
\t\t</div>
\t</div>

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
        // line 121
        echo ($context["bodyScript"] ?? null);
        echo "
</script>

</body>

</html>";
    }

    public function getTemplateName()
    {
        return "login.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  165 => 121,  66 => 25,  46 => 8,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<!DOCTYPE html>
<html lang=\"en-US\">

<head>
    <meta http-equiv=Content-Type content=\"text/html; charset=utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">

    <title>{{ title|e }}</title>
    <link rel=\"icon\" type=image/ico href=\"/static/favicon2.png\"/>
    <meta name=description content=\"Content.\" />
    <meta name=keywords content=\"keyword1 keyword2 keyword3 keyword4\" />
    
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/style.css\">
\t<link rel=\"stylesheet\" type=\"text/css\" href=\"//stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">
\t<link rel=\"stylesheet\" type=\"text/css\" href=\"//stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css\">

\t<link rel=\"stylesheet\" type=\"text/css\" href=\"//cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css\"/> 

\t<script src=\"//code.jquery.com/jquery-3.4.1.min.js\" integrity=\"sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=\" crossorigin=\"anonymous\"></script>

\t<script src=\"//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\" integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\" crossorigin=\"anonymous\"></script>
\t<script src=\"//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\" integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\" crossorigin=\"anonymous\"></script>

    {{ pageJS | raw }}

</head>

<body>
\t<header>
\t\t<div class=\"container-fluid\" style=\"height:.25rem;background-color:rgba(10, 24, 66,1);\"></div>        
\t\t<nav class=\"navbar navbar-expand-md navbar-dark sticky-top\">
\t\t\t<a class=\"navbar-brand\" href=\"/\">Budget Log</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapsingNavbarLg\"><span class=\"navbar-toggler-icon\"></span></button>
\t\t\t
\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbarLg\">
\t\t\t\t<ul class=\"navbar-nav\">
\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/\">Work In Progress</a>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\"nav-item\">
\t\t\t\t\t\t<a class=\"nav-link\" href=\"/about\">Work in Progress</a>
\t\t\t\t\t</li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t</nav>
\t</header>


   <div class=\"container-fluid\">
\t\t<div class=\"row\">
\t\t\t<!-- Form from https://getbootstrap.com/docs/4.0/examples/sign-in/ -->
\t\t\t<form class=\"text-center\" style=\"max-width:330px;padding:15px;margin:0 auto\">
\t\t\t\t<img class=\"mb-4\" src=\"/static/slug.png\" alt=\"\" width=\"150\" height=\"150\">
\t\t\t\t<h1 class=\"h3 mb-3 font-weight-normal\">Please sign in</h1>
\t\t\t\t\t<label for=\"inputEmail\" class=\"sr-only\">Email address</label>
\t\t\t\t\t<input type=\"email\" id=\"inputEmail\" class=\"form-control mb-2 py-4 px-2\" placeholder=\"Email address\" required=\"\" autofocus=\"\">
\t\t\t\t\t<label for=\"inputPassword\" class=\"sr-only\">Password</label>
\t\t\t\t\t<input type=\"password\" id=\"inputPassword\" class=\"form-control mb-2 py-4 px-2\" placeholder=\"Password\" required=\"\">
\t\t\t\t\t<div class=\"checkbox mb-2\">
\t\t\t\t\t\t<label>
\t\t\t\t\t\t\t<input type=\"checkbox\" value=\"remember-me\"> Remember me
\t\t\t\t\t\t</label>
\t\t\t\t\t</div>
\t\t\t\t\t<button id=\"login-button\" class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Sign in</button>
\t\t\t\t</form>
\t\t</div>
\t</div>
\t
\t<div class=\"row flex-xl-nowrap\">
\t\t<div class=\"col-12 font-small pt-4\" style=\"background: rgba(10, 24, 66,1);\">
\t\t\t<div class=\"row\">
\t
\t\t\t\t<div class=\"col-md-6 mt-md-0 mt-3\">
\t\t\t\t\t<h5 class=\"text-uppercase\">CHIMPS v5.2</h5>
\t\t\t\t\t<p>Under development</p>
\t\t\t\t</div>\t\t
\t\t\t\t<div class=\"col-md-6 mb-md-0 mb-3\">
\t\t\t\t\t<h5 class=\"text-uppercase\">Links</h5>
\t\t\t\t\t<ul class=\"list-unstyled\">
\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t<a href=\"#!\">Link 1</a>
\t\t\t\t\t\t</li>
\t\t\t\t\t</ul>
\t\t\t\t</div>
\t\t\t</div>

\t\t\t<div class=\"footer-copyright text-center\">© 2019
\t\t\t\t<a href=\"test\">Email</a>
\t\t\t</div>\t\t\t
\t\t</div>
\t</div>

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

</html>", "login.html", "/var/www/econforecasting.com/public/templates/login.html");
    }
}
