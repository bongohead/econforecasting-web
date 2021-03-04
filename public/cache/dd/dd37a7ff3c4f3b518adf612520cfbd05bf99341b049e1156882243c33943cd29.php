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

/* blog.html */
class __TwigTemplate_a4e9843d31667e1aa04708343011915ea8bf5cd504a6d1642be19df1ea015bb3 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("base.html", "blog.html", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_meta($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 3
        echo "<meta name=\"description\" content=\"The blog for the Center for Macroeconomic Forecasts & Insights.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/blog\">
";
    }

    // line 7
    public function block_staticlinks($context, array $blocks = [])
    {
        $macros = $this->macros;
    }

    // line 12
    public function block_content($context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 13
        echo "<div class=\"container-fluid\">
<div class=\"container\">
\t<div class=\"row mb-5 mt-4\">
\t\t<div class=\"col-md-8 blog-main\" style=\"font-size:1.0rem\">
\t\t\t<div class=\"jumbotron p-4 p-md-5 text-white rounded bg-dark\">
\t\t\t\t<div class=\"col-md-6 px-0\">
\t\t\t\t  <h1 class=\"display-4 font-italic\">A guide to nowcasting time series</h1>
\t\t\t\t  <p class=\"blog-post-meta fst-italic py-0\">Feb. 2021 by Charles Y.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"blog-post pt-3\">
\t\t\t\t<h3>What is nowcasting?</h3>
\t\t\t\t<h3>What is nowcasting?</h3>
\t\t\t\t<h3>Methododology</h3>
\t\t\t\t
\t\t\t\t\$\\begin{bmatrix}a & b\\\\c & d\\end{bmatrix}\$
\t\t\t\t
\t\t\t\tOur approach follows the methodolgoy of Giannone, Reichlin, and Small (2008). We will begin by extracting a few common factor variables underlying.
\t\t\t\t<p>This blog post shows a few different types of content that’s supported and styled with Bootstrap. Basic typography, images, and code are all supported.</p>
\t\t\t\t<hr>
\t\t\t\t<p>Yeah, she dances to her own beat. Oh, no. You could've been the greatest. 'Cause, baby, <a href=\"#\">you're a firework</a>. Maybe a reason why all the doors are closed. Open up your heart and just let it begin. So très chic, yeah, she's a classic.</p>
\t\t\t\t<blockquote>
\t\t\t\t<p>Bikinis, zucchinis, Martinis, no weenies. I know there will be sacrifice but that's the price. <strong>This is how we do it</strong>. I'm not sticking around to watch you go down. You think you're so rock and roll, but you're really just a joke. I know one spark will shock the world, yeah yeah. Can't replace you with a million rings.</p>
\t\t\t\t</blockquote>
\t\t\t\t<p>Trying to connect the dots, don't know what to tell my boss. Before you met me I was alright but things were kinda heavy. You just gotta ignite the light and let it shine. Glitter all over the room <em>pink flamingos</em> in the pool. </p>
\t\t\t\t<h2>Heading</h2>
\t\t\t\t<p>Suiting up for my crowning battle. If you only knew what the future holds. Bring the beat back. Peach-pink lips, yeah, everybody stares.</p>
\t\t\t\t<h3>Sub-heading</h3>
\t\t\t\t<p>You give a hundred reasons why, and you say you're really gonna try. Straight stuntin' yeah we do it like that. Calling out my name. ‘Cause I, I’m capable of anything.</p>
\t\t\t\t<pre><code>Example code block</code></pre>
\t\t\t\t<p>Before you met me I was alright but things were kinda heavy. You just gotta ignite the light and let it shine.</p>
\t\t\t\t<h3>Sub-heading</h3>
\t\t\t\t<p>You got the finest architecture. Passport stamps, she's cosmopolitan. Fine, fresh, fierce, we got it on lock. Never planned that one day I'd be losing you. She eats your heart out.</p>
\t\t\t\t<ul>
\t\t\t\t<li>Got a motel and built a fort out of sheets.</li>
\t\t\t\t<li>Your kiss is cosmic, every move is magic.</li>
\t\t\t\t<li>Suiting up for my crowning battle.</li>
\t\t\t\t</ul>
\t\t\t\t<p>Takes you miles high, so high, 'cause she’s got that one international smile.</p>
\t\t\t\t<ol>
\t\t\t\t<li>Scared to rock the boat and make a mess.</li>
\t\t\t\t<li>I could have rewrite your addiction.</li>
\t\t\t\t<li>I know you get me so I let my walls come down.</li>
\t\t\t\t</ol>
\t\t\t\t<p>After a hurricane comes a rainbow.</p>
\t\t\t</div><!-- /.blog-post -->

\t\t\t<div class=\"blog-post\">
\t\t\t\t<h2 class=\"blog-post-title\">Another blog post</h2>
\t\t\t\t<p class=\"blog-post-meta\">December 23, 2013 by <a href=\"#\">Jacob</a></p>

\t\t\t\t<p>I am ready for the road less traveled. Already <a href=\"#\">brushing off the dust</a>. Yeah, you're lucky if you're on her plane. I used to bite my tongue and hold my breath. Uh, She’s a beast. I call her Karma (come back). Black ray-bans, you know she's with the band. I can't sleep let's run away and don't ever look back, don't ever look back.</p>
\t\t\t\t<blockquote>
\t\t\t\t<p>Growing fast into a <strong>bolt of lightning</strong>. Be careful Try not to lead her on</p>
\t\t\t\t</blockquote>
\t\t\t\t<p>I'm intrigued, for a peek, heard it's fascinating. Oh oh! Wanna be a victim ready for abduction. She's got that international smile, oh yeah, she's got that one international smile. Do you ever feel, feel so paper thin. I’m gon’ put her in a coma. Sun-kissed skin so hot we'll melt your popsicle.</p>
\t\t\t\t<p>This is transcendental, on another level, boy, you're my lucky star.</p>
\t\t\t</div><!-- /.blog-post -->

\t\t\t<div class=\"blog-post\">
\t\t\t\t<h2 class=\"blog-post-title\">New feature</h2>
\t\t\t\t<p class=\"blog-post-meta\">December 14, 2013 by <a href=\"#\">Chris</a></p>

\t\t\t\t<p>From Tokyo to Mexico, to Rio. Yeah, you take me to utopia. I'm walking on air. We'd make out in your Mustang to Radiohead. I mean the ones, I mean like she's the one. Sun-kissed skin so hot we'll melt your popsicle. Slow cooking pancakes for my boy, still up, still fresh as a Daisy.</p>
\t\t\t\t<ul>
\t\t\t\t<li>I hope you got a healthy appetite.</li>
\t\t\t\t<li>You're never gonna be unsatisfied.</li>
\t\t\t\t<li>Got a motel and built a fort out of sheets.</li>
\t\t\t\t</ul>
\t\t\t\t<p>Don't need apologies. Boy, you're an alien your touch so foreign, it's <em>supernatural</em>, extraterrestrial. Talk about our future like we had a clue. I can feel a phoenix inside of me.</p>
\t\t\t</div><!-- /.blog-post -->

\t\t\t<nav class=\"blog-pagination\">
\t\t\t\t<a class=\"btn btn-outline-primary\" href=\"#\">Older</a>
\t\t\t\t<a class=\"btn btn-outline-secondary disabled\" href=\"#\" tabindex=\"-1\" aria-disabled=\"true\">Newer</a>
\t\t\t</nav>
\t\t</div><!-- /.blog-main -->

\t\t<aside class=\"col-md-4 blog-sidebar\">
\t\t\t<div class=\"p-4 mb-3 bg-light rounded\">
\t\t\t<h4 class=\"font-italic\">About</h4>
\t\t\t<p class=\"mb-0\">Saw you downtown singing the Blues. Watch you circle the drain. Why don't you let me stop by? Heavy is the head that <em>wears the crown</em>. Yes, we make angels cry, raining down on earth from up above.</p>
\t\t\t</div>

\t\t\t<div class=\"p-4\">
\t\t\t\t<h4 class=\"font-italic\">Archives</h4>
\t\t\t\t<ol class=\"list-unstyled mb-0\">
\t\t\t\t<li><a href=\"#\">March 2014</a></li>
\t\t\t\t<li><a href=\"#\">February 2014</a></li>
\t\t\t\t<li><a href=\"#\">January 2014</a></li>
\t\t\t\t<li><a href=\"#\">December 2013</a></li>
\t\t\t\t<li><a href=\"#\">November 2013</a></li>
\t\t\t\t<li><a href=\"#\">October 2013</a></li>
\t\t\t\t<li><a href=\"#\">September 2013</a></li>
\t\t\t\t<li><a href=\"#\">August 2013</a></li>
\t\t\t\t<li><a href=\"#\">July 2013</a></li>
\t\t\t\t<li><a href=\"#\">June 2013</a></li>
\t\t\t\t<li><a href=\"#\">May 2013</a></li>
\t\t\t\t<li><a href=\"#\">April 2013</a></li>
\t\t\t\t</ol>
\t\t\t</div>

\t\t\t<div class=\"p-4\">
\t\t\t\t<h4 class=\"font-italic\">Elsewhere</h4>
\t\t\t\t<ol class=\"list-unstyled\">
\t\t\t\t<li><a href=\"#\">GitHub</a></li>
\t\t\t\t<li><a href=\"#\">Twitter</a></li>
\t\t\t\t<li><a href=\"#\">Facebook</a></li>
\t\t\t\t</ol>
\t\t\t</div>
\t\t</aside><!-- /.blog-sidebar -->

\t</div>
 </div></div>
 ";
    }

    public function getTemplateName()
    {
        return "blog.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  68 => 13,  64 => 12,  58 => 7,  52 => 3,  48 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"base.html\" %}
{% block meta %}
<meta name=\"description\" content=\"The blog for the Center for Macroeconomic Forecasts & Insights.\"/>
<link rel=\"canonical\" href=\"https://econforecasting.com/blog\">
{% endblock %}

{% block staticlinks %}
{% endblock %}



{% block content %}
<div class=\"container-fluid\">
<div class=\"container\">
\t<div class=\"row mb-5 mt-4\">
\t\t<div class=\"col-md-8 blog-main\" style=\"font-size:1.0rem\">
\t\t\t<div class=\"jumbotron p-4 p-md-5 text-white rounded bg-dark\">
\t\t\t\t<div class=\"col-md-6 px-0\">
\t\t\t\t  <h1 class=\"display-4 font-italic\">A guide to nowcasting time series</h1>
\t\t\t\t  <p class=\"blog-post-meta fst-italic py-0\">Feb. 2021 by Charles Y.</p>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\"blog-post pt-3\">
\t\t\t\t<h3>What is nowcasting?</h3>
\t\t\t\t<h3>What is nowcasting?</h3>
\t\t\t\t<h3>Methododology</h3>
\t\t\t\t
\t\t\t\t\$\\begin{bmatrix}a & b\\\\c & d\\end{bmatrix}\$
\t\t\t\t
\t\t\t\tOur approach follows the methodolgoy of Giannone, Reichlin, and Small (2008). We will begin by extracting a few common factor variables underlying.
\t\t\t\t<p>This blog post shows a few different types of content that’s supported and styled with Bootstrap. Basic typography, images, and code are all supported.</p>
\t\t\t\t<hr>
\t\t\t\t<p>Yeah, she dances to her own beat. Oh, no. You could've been the greatest. 'Cause, baby, <a href=\"#\">you're a firework</a>. Maybe a reason why all the doors are closed. Open up your heart and just let it begin. So très chic, yeah, she's a classic.</p>
\t\t\t\t<blockquote>
\t\t\t\t<p>Bikinis, zucchinis, Martinis, no weenies. I know there will be sacrifice but that's the price. <strong>This is how we do it</strong>. I'm not sticking around to watch you go down. You think you're so rock and roll, but you're really just a joke. I know one spark will shock the world, yeah yeah. Can't replace you with a million rings.</p>
\t\t\t\t</blockquote>
\t\t\t\t<p>Trying to connect the dots, don't know what to tell my boss. Before you met me I was alright but things were kinda heavy. You just gotta ignite the light and let it shine. Glitter all over the room <em>pink flamingos</em> in the pool. </p>
\t\t\t\t<h2>Heading</h2>
\t\t\t\t<p>Suiting up for my crowning battle. If you only knew what the future holds. Bring the beat back. Peach-pink lips, yeah, everybody stares.</p>
\t\t\t\t<h3>Sub-heading</h3>
\t\t\t\t<p>You give a hundred reasons why, and you say you're really gonna try. Straight stuntin' yeah we do it like that. Calling out my name. ‘Cause I, I’m capable of anything.</p>
\t\t\t\t<pre><code>Example code block</code></pre>
\t\t\t\t<p>Before you met me I was alright but things were kinda heavy. You just gotta ignite the light and let it shine.</p>
\t\t\t\t<h3>Sub-heading</h3>
\t\t\t\t<p>You got the finest architecture. Passport stamps, she's cosmopolitan. Fine, fresh, fierce, we got it on lock. Never planned that one day I'd be losing you. She eats your heart out.</p>
\t\t\t\t<ul>
\t\t\t\t<li>Got a motel and built a fort out of sheets.</li>
\t\t\t\t<li>Your kiss is cosmic, every move is magic.</li>
\t\t\t\t<li>Suiting up for my crowning battle.</li>
\t\t\t\t</ul>
\t\t\t\t<p>Takes you miles high, so high, 'cause she’s got that one international smile.</p>
\t\t\t\t<ol>
\t\t\t\t<li>Scared to rock the boat and make a mess.</li>
\t\t\t\t<li>I could have rewrite your addiction.</li>
\t\t\t\t<li>I know you get me so I let my walls come down.</li>
\t\t\t\t</ol>
\t\t\t\t<p>After a hurricane comes a rainbow.</p>
\t\t\t</div><!-- /.blog-post -->

\t\t\t<div class=\"blog-post\">
\t\t\t\t<h2 class=\"blog-post-title\">Another blog post</h2>
\t\t\t\t<p class=\"blog-post-meta\">December 23, 2013 by <a href=\"#\">Jacob</a></p>

\t\t\t\t<p>I am ready for the road less traveled. Already <a href=\"#\">brushing off the dust</a>. Yeah, you're lucky if you're on her plane. I used to bite my tongue and hold my breath. Uh, She’s a beast. I call her Karma (come back). Black ray-bans, you know she's with the band. I can't sleep let's run away and don't ever look back, don't ever look back.</p>
\t\t\t\t<blockquote>
\t\t\t\t<p>Growing fast into a <strong>bolt of lightning</strong>. Be careful Try not to lead her on</p>
\t\t\t\t</blockquote>
\t\t\t\t<p>I'm intrigued, for a peek, heard it's fascinating. Oh oh! Wanna be a victim ready for abduction. She's got that international smile, oh yeah, she's got that one international smile. Do you ever feel, feel so paper thin. I’m gon’ put her in a coma. Sun-kissed skin so hot we'll melt your popsicle.</p>
\t\t\t\t<p>This is transcendental, on another level, boy, you're my lucky star.</p>
\t\t\t</div><!-- /.blog-post -->

\t\t\t<div class=\"blog-post\">
\t\t\t\t<h2 class=\"blog-post-title\">New feature</h2>
\t\t\t\t<p class=\"blog-post-meta\">December 14, 2013 by <a href=\"#\">Chris</a></p>

\t\t\t\t<p>From Tokyo to Mexico, to Rio. Yeah, you take me to utopia. I'm walking on air. We'd make out in your Mustang to Radiohead. I mean the ones, I mean like she's the one. Sun-kissed skin so hot we'll melt your popsicle. Slow cooking pancakes for my boy, still up, still fresh as a Daisy.</p>
\t\t\t\t<ul>
\t\t\t\t<li>I hope you got a healthy appetite.</li>
\t\t\t\t<li>You're never gonna be unsatisfied.</li>
\t\t\t\t<li>Got a motel and built a fort out of sheets.</li>
\t\t\t\t</ul>
\t\t\t\t<p>Don't need apologies. Boy, you're an alien your touch so foreign, it's <em>supernatural</em>, extraterrestrial. Talk about our future like we had a clue. I can feel a phoenix inside of me.</p>
\t\t\t</div><!-- /.blog-post -->

\t\t\t<nav class=\"blog-pagination\">
\t\t\t\t<a class=\"btn btn-outline-primary\" href=\"#\">Older</a>
\t\t\t\t<a class=\"btn btn-outline-secondary disabled\" href=\"#\" tabindex=\"-1\" aria-disabled=\"true\">Newer</a>
\t\t\t</nav>
\t\t</div><!-- /.blog-main -->

\t\t<aside class=\"col-md-4 blog-sidebar\">
\t\t\t<div class=\"p-4 mb-3 bg-light rounded\">
\t\t\t<h4 class=\"font-italic\">About</h4>
\t\t\t<p class=\"mb-0\">Saw you downtown singing the Blues. Watch you circle the drain. Why don't you let me stop by? Heavy is the head that <em>wears the crown</em>. Yes, we make angels cry, raining down on earth from up above.</p>
\t\t\t</div>

\t\t\t<div class=\"p-4\">
\t\t\t\t<h4 class=\"font-italic\">Archives</h4>
\t\t\t\t<ol class=\"list-unstyled mb-0\">
\t\t\t\t<li><a href=\"#\">March 2014</a></li>
\t\t\t\t<li><a href=\"#\">February 2014</a></li>
\t\t\t\t<li><a href=\"#\">January 2014</a></li>
\t\t\t\t<li><a href=\"#\">December 2013</a></li>
\t\t\t\t<li><a href=\"#\">November 2013</a></li>
\t\t\t\t<li><a href=\"#\">October 2013</a></li>
\t\t\t\t<li><a href=\"#\">September 2013</a></li>
\t\t\t\t<li><a href=\"#\">August 2013</a></li>
\t\t\t\t<li><a href=\"#\">July 2013</a></li>
\t\t\t\t<li><a href=\"#\">June 2013</a></li>
\t\t\t\t<li><a href=\"#\">May 2013</a></li>
\t\t\t\t<li><a href=\"#\">April 2013</a></li>
\t\t\t\t</ol>
\t\t\t</div>

\t\t\t<div class=\"p-4\">
\t\t\t\t<h4 class=\"font-italic\">Elsewhere</h4>
\t\t\t\t<ol class=\"list-unstyled\">
\t\t\t\t<li><a href=\"#\">GitHub</a></li>
\t\t\t\t<li><a href=\"#\">Twitter</a></li>
\t\t\t\t<li><a href=\"#\">Facebook</a></li>
\t\t\t\t</ol>
\t\t\t</div>
\t\t</aside><!-- /.blog-sidebar -->

\t</div>
 </div></div>
 {% endblock %}", "blog.html", "/var/www/econforecasting.com/public/templates/blog.html");
    }
}
