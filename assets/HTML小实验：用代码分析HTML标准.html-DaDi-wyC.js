import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,a,o as i}from"./app-6Bz2fGO5.js";const l={};function t(p,n){return i(),s("div",null,n[0]||(n[0]=[a(`<p><audio id="audio" title="HTML小实验：用代码分析HTML标准" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/a7/3f/a7864d32419da6d7e6d15a2e9f6a333f.mp3"></audio></p><p>你好，我是winter。</p><p>前面的课程中，我们已经讲解了大部分的HTML标签。</p><p>然而，为了突出重点，我们还是会忽略一些标签类型。比如表单类标签和表格类标签，我认为只有少数前端工程师用过，比如我在整个手机淘宝的工作生涯中，一次表格类标签都没有用到，表单类则只用过input，也只有几次。</p><p>那么，剩下的标签我们怎么样去了解它们呢？当然是查阅HTML标准。</p><p>由于阅读标准有一定门槛，需要了解一些机制，这节课，我为你设计了一个小实验，用JavaScript代码去抽取标准中我们需要的信息。</p><h2 id="html标准" tabindex="-1"><a class="header-anchor" href="#html标准"><span>HTML标准</span></a></h2><p>我们采用WHATWG的living standard标准，我们先来看看标准是如何描述一个标签的，这里我们看到，有下面这些内容。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Categories:</span></span>
<span class="line"><span>    Flow content.</span></span>
<span class="line"><span>    Phrasing content.</span></span>
<span class="line"><span>    Embedded content.</span></span>
<span class="line"><span>    If the element has a controls attribute: Interactive content.</span></span>
<span class="line"><span>    Palpable content.</span></span>
<span class="line"><span>Contexts in which this element can be used:</span></span>
<span class="line"><span>    Where embedded content is expected.</span></span>
<span class="line"><span>Content model:</span></span>
<span class="line"><span>    If the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span>    If the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span>Tag omission in text/html:</span></span>
<span class="line"><span>    Neither tag is omissible.</span></span>
<span class="line"><span>Content attributes:</span></span>
<span class="line"><span>    Global attributes</span></span>
<span class="line"><span>    src — Address of the resource</span></span>
<span class="line"><span>    crossorigin — How the element handles crossorigin requests</span></span>
<span class="line"><span>    poster — Poster frame to show prior to video playback</span></span>
<span class="line"><span>    preload — Hints how much buffering the media resource will likely need</span></span>
<span class="line"><span>    autoplay — Hint that the media resource can be started automatically when the page is loaded</span></span>
<span class="line"><span>    playsinline — Encourage the user agent to display video content within the element&#39;s playback area</span></span>
<span class="line"><span>    loop — Whether to loop the media resource</span></span>
<span class="line"><span>    muted — Whether to mute the media resource by default</span></span>
<span class="line"><span>    controls — Show user agent controls</span></span>
<span class="line"><span>    width — Horizontal dimension</span></span>
<span class="line"><span>    height — Vertical dimension</span></span>
<span class="line"><span>DOM interface:</span></span>
<span class="line"><span>    [Exposed=Window, HTMLConstructor]</span></span>
<span class="line"><span>    interface HTMLVideoElement : HTMLMediaElement {</span></span>
<span class="line"><span>      [CEReactions] attribute unsigned long width;</span></span>
<span class="line"><span>      [CEReactions] attribute unsigned long height;</span></span>
<span class="line"><span>      readonly attribute unsigned long videoWidth;</span></span>
<span class="line"><span>      readonly attribute unsigned long videoHeight;</span></span>
<span class="line"><span>      [CEReactions] attribute USVString poster;</span></span>
<span class="line"><span>      [CEReactions] attribute boolean playsInline;</span></span>
<span class="line"><span>    };</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们看到，这里的描述分为6个部分，有下面这些内容。</p><ul><li>Categories：标签所属的分类。</li><li>Contexts in which this element can be used：标签能够用在哪里。</li><li>Content model：标签的内容模型。</li><li>Tag omission in text/html：标签是否可以省略。</li><li>Content attributes：内容属性。</li><li>DOM interface：用WebIDL定义的元素类型接口。</li></ul><p>这一节课，我们关注一下Categories、Contexts in which this element can be used、Content model这几个部分。我会带你从标准中抓取数据，做一个小工具，用来检查X标签是否能放入Y标签内。</p><h2 id="代码角度分析html标准" tabindex="-1"><a class="header-anchor" href="#代码角度分析html标准"><span>代码角度分析HTML标准</span></a></h2><p>HTML标准描述用词非常的严谨，这给我们抓取数据带来了巨大的方便，首先，我们打开单页面版HTML标准：</p><ul><li><a href="https://html.spec.whatwg.org/" target="_blank" rel="noopener noreferrer">https://html.spec.whatwg.org/</a></li></ul><p>在这个页面上，我们执行一下以下代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Array.prototype.map.call(document.querySelectorAll(&amp;quot;.element&amp;quot;), e=&amp;gt;e.innerText);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这样我们就得到了所有元素的定义了，现在有107个元素。</p><p>不过，比较尴尬的是，这些文本中并不包含元素名，我们只好从id属性中获取，最后代码类似这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>var elementDefinations = Array.prototype.map.call(document.querySelectorAll(&quot;.element&quot;), e =&amp;gt; ({</span></span>
<span class="line"><span>  text:e.innerText,</span></span>
<span class="line"><span>  name:e.childNodes[0].childNodes[0].id.match(/the\\-([\\s\\S]+)\\-element:/)?RegExp.$1:null}));</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来我们用代码理解一下这些文本。首先我们来分析一下这些文本，它分成了6个部分，而且顺序非常固定，这样，我们可以用JavaScript的正则表达式匹配来拆分六个字段。</p><p>我们这个小实验的目标是计算元素之间的包含关系，因此，我们先关心一下categories和contentModel两个字段。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for(let defination of elementDefinations) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  console.log(defination.name + &quot;:&quot;)</span></span>
<span class="line"><span>  let categories = defination.text.match(/Categories:\\n([\\s\\S]+)\\nContexts in which this element can be used:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  for(let category of categories) {</span></span>
<span class="line"><span>      console.log(category);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>  let contentModel = defination.text.match(/Content model:\\n([\\s\\S]+)\\nTag omission in text\\/html:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  for(let line of contentModel)</span></span>
<span class="line"><span>    console.log(line);</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来我们来处理category。</p><p>首先category的写法中，最基本的就是直接描述了category的句子，我们把这些不带任何条件的category先保存起来，然后打印出来其它的描述看看：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for(let defination of elementDefinations) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //console.log(defination.name + &quot;:&quot;)</span></span>
<span class="line"><span>  let categories = defination.text.match(/Categories:\\n([\\s\\S]+)\\nContexts in which this element can be used:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  defination.categories = [];</span></span>
<span class="line"><span>  for(let category of categories) {</span></span>
<span class="line"><span>    if(category.match(/^([^ ]+) content./))</span></span>
<span class="line"><span>      defination.categories.push(RegExp.$1);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>      console.log(category)  </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>  let contentModel = defination.text.match(/Content model:\\n([\\s\\S]+)\\nTag omission in text\\/html:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  for(let line of contentModel)</span></span>
<span class="line"><span>    console.log(line);</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们要处理的第一个逻辑是带if的情况。</p><p>然后我们来看看剩下的情况：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> None.</span></span>
<span class="line"><span> Sectioning root.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> Sectioning root.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> Form-associated element.</span></span>
<span class="line"><span> Listed and submittable form-associated element.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> Sectioning root.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> If the type attribute is not in the Hidden state: Listed, labelable, submittable, resettable, and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> If the type attribute is in the Hidden state: Listed, submittable, resettable, and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> Listed, labelable, submittable, and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> Listed, labelable, submittable, resettable, and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> Listed, labelable, submittable, resettable, and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> Listed, labelable, resettable, and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> Labelable element.</span></span>
<span class="line"><span> Sectioning root.</span></span>
<span class="line"><span> Listed and autocapitalize-inheriting form-associated element.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> Sectioning root.</span></span>
<span class="line"><span> None.</span></span>
<span class="line"><span> Sectioning root.</span></span>
<span class="line"><span> Script-supporting element.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里出现了几个概念：</p><ul><li>None</li><li>Sectioning root</li><li>Form-associated element</li><li>Labelable element</li><li>Script-supporting element</li></ul><p>如果我们要真正完美地实现元素分类，就必须要在代码中加入正则表达式来解析这些规则，这里作为今天的课后问题，留给你自己完成。</p><p>接下来我们看看Content Model，我们照例先处理掉最简单点的部分，就是带分类的内容模型：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>for(let defination of elementDefinations) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //console.log(defination.name + &quot;:&quot;)</span></span>
<span class="line"><span>  let categories = defination.text.match(/Categories:\\n([\\s\\S]+)\\nContexts in which this element can be used:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  defination.contentModel = [];</span></span>
<span class="line"><span>  let contentModel = defination.text.match(/Content model:\\n([\\s\\S]+)\\nTag omission in text\\/html:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  for(let line of contentModel)</span></span>
<span class="line"><span>    if(line.match(/^([^ ]+) content./))</span></span>
<span class="line"><span>      defination.contentModel.push(RegExp.$1);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>      console.log(line)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>好了，我们照例看看剩下了什么：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> A head element followed by a body element.</span></span>
<span class="line"><span> If the document is an iframe srcdoc document or if title information is available from a higher-level protocol: Zero or more elements of metadata content, of which no more than one is a title element and no more than one is a base element.</span></span>
<span class="line"><span> Otherwise: One or more elements of metadata content, of which exactly one is a title element and no more than one is a base element.</span></span>
<span class="line"><span> Text that is not inter-element whitespace.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Text that gives a conformant style sheet.</span></span>
<span class="line"><span> One or more h1, h2, h3, h4, h5, h6 elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Zero or more li and script-supporting elements.</span></span>
<span class="line"><span> Either: Zero or more groups each consisting of one or more dt elements followed by one or more dd elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span> Or: One or more div elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span> Either: one figcaption element followed by flow content.</span></span>
<span class="line"><span> Or: flow content followed by one figcaption element.</span></span>
<span class="line"><span> Or: flow content.</span></span>
<span class="line"><span> If the element is a child of a dl element: one or more dt elements followed by one or more dd elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span> If the element is not a child of a dl element: flow content.</span></span>
<span class="line"><span> Transparent, but there must be no interactive content or a element descendants.</span></span>
<span class="line"><span> See prose.</span></span>
<span class="line"><span> Text.</span></span>
<span class="line"><span> If the element has a datetime attribute: Phrasing content.</span></span>
<span class="line"><span> Otherwise: Text, but must match requirements described in prose below.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Transparent.</span></span>
<span class="line"><span> Zero or more source elements, followed by one img element, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Zero or more param elements, then, transparent.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> If the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span> If the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span> If the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span> If the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Transparent.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> In this order: optionally a caption element, followed by zero or more colgroup elements, followed optionally by a thead element, followed by either zero or more tbody elements or one or more tr elements, followed optionally by a tfoot element, optionally intermixed with one or more script-supporting elements.</span></span>
<span class="line"><span> If the span attribute is present: Nothing.</span></span>
<span class="line"><span> If the span attribute is absent: Zero or more col and template elements.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Zero or more tr and script-supporting elements.</span></span>
<span class="line"><span> Zero or more td, th, and script-supporting elements.</span></span>
<span class="line"><span> Nothing.</span></span>
<span class="line"><span> Zero or more option, optgroup, and script-supporting elements.</span></span>
<span class="line"><span> Either: phrasing content.</span></span>
<span class="line"><span> Or: Zero or more option and script-supporting elements.</span></span>
<span class="line"><span> Zero or more option and script-supporting elements.</span></span>
<span class="line"><span> If the element has a label attribute and a value attribute: Nothing.</span></span>
<span class="line"><span> If the element has a label attribute but no value attribute: Text.</span></span>
<span class="line"><span> If the element has no label attribute and is not a child of a datalist element: Text that is not inter-element whitespace.</span></span>
<span class="line"><span> If the element has no label attribute and is a child of a datalist element: Text.</span></span>
<span class="line"><span> Text.</span></span>
<span class="line"><span> Optionally a legend element, followed by flow content.</span></span>
<span class="line"><span> One summary element followed by flow content.</span></span>
<span class="line"><span> Either: phrasing content.</span></span>
<span class="line"><span> Or: one element of heading content.</span></span>
<span class="line"><span> If there is no src attribute, depends on the value of the type attribute, but must match script content restrictions.</span></span>
<span class="line"><span> If there is a src attribute, the element must be either empty or contain only script documentation that also matches script content restrictions.</span></span>
<span class="line"><span> When scripting is disabled, in a head element: in any order, zero or more link elements, zero or more style elements, and zero or more meta elements.</span></span>
<span class="line"><span> When scripting is disabled, not in a head element: transparent, but there must be no noscript element descendants.</span></span>
<span class="line"><span> Otherwise: text that conforms to the requirements given in the prose.</span></span>
<span class="line"><span> Nothing (for clarification, see example).</span></span>
<span class="line"><span> Transparent</span></span>
<span class="line"><span> Transparent, but with no interactive content descendants except for a elements, img elements with usemap attributes, button elements, input elements whose type attribute are in the Checkbox or Radio Button states, input elements that are buttons, select elements with a multiple attribute or a display size greater than 1, and elements that would not be interactive content except for having the tabindex attribute specified.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这有点复杂，我们还是把它做一些分类，首先我们过滤掉带If的情况、Text和Transparent。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for(let defination of elementDefinations) {</span></span>
<span class="line"><span>  //console.log(defination.name + &quot;:&quot;)</span></span>
<span class="line"><span>  let categories = defination.text.match(/Categories:\\n([\\s\\S]+)\\nContexts in which this element can be used:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  defination.contentModel = [];</span></span>
<span class="line"><span>  let contentModel = defination.text.match(/Content model:\\n([\\s\\S]+)\\nTag omission in text\\/html:/)[1].split(&quot;\\n&quot;);</span></span>
<span class="line"><span>  for(let line of contentModel)</span></span>
<span class="line"><span>    if(line.match(/([^ ]+) content./))</span></span>
<span class="line"><span>      defination.contentModel.push(RegExp.$1);</span></span>
<span class="line"><span>    else if(line.match(/Nothing.|Transparent./));</span></span>
<span class="line"><span>    else if(line.match(/^Text[\\s\\S]*.$/));</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>      console.log(line)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候我们再来执行看看：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>A head element followed by a body element.</span></span>
<span class="line"><span>One or more h1, h2, h3, h4, h5, h6 elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span>Zero or more li and script-supporting elements.</span></span>
<span class="line"><span>Either: Zero or more groups each consisting of one or more dt elements followed by one or more dd elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span>Or: One or more div elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span>If the element is a child of a dl element: one or more dt elements followed by one or more dd elements, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span>See prose.</span></span>
<span class="line"><span>Otherwise: Text, but must match requirements described in prose below.</span></span>
<span class="line"><span>Zero or more source elements, followed by one img element, optionally intermixed with script-supporting elements.</span></span>
<span class="line"><span>Zero or more param elements, then, transparent.</span></span>
<span class="line"><span>If the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span>If the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span>If the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span>If the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants.</span></span>
<span class="line"><span>In this order: optionally a caption element, followed by zero or more colgroup elements, followed optionally by a thead element, followed by either zero or more tbody elements or one or more tr elements, followed optionally by a tfoot element, optionally intermixed with one or more script-supporting elements.</span></span>
<span class="line"><span>If the span attribute is absent: Zero or more col and template elements.</span></span>
<span class="line"><span>Zero or more tr and script-supporting elements.</span></span>
<span class="line"><span>Zero or more td, th, and script-supporting elements.</span></span>
<span class="line"><span>Zero or more option, optgroup, and script-supporting elements.</span></span>
<span class="line"><span>Or: Zero or more option and script-supporting elements.</span></span>
<span class="line"><span>Zero or more option and script-supporting elements.</span></span>
<span class="line"><span>If the element has a label attribute but no value attribute: Text.</span></span>
<span class="line"><span>If the element has no label attribute and is not a child of a datalist element: Text that is not inter-element whitespace.</span></span>
<span class="line"><span>If the element has no label attribute and is a child of a datalist element: Text.</span></span>
<span class="line"><span>When scripting is disabled, in a head element: in any order, zero or more link elements, zero or more style elements, and zero or more meta elements.</span></span>
<span class="line"><span>When scripting is disabled, not in a head element: transparent, but there must be no noscript element descendants.</span></span>
<span class="line"><span>Otherwise: text that conforms to the requirements given in the prose.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这下剩余的就少多了，我们可以看到，基本上剩下的都是直接描述可用的元素了，如果你愿意，还可以用代码进一步解析，不过如果是我的话，会选择手工把它们写成JSON了，毕竟只有三十多行文本。</p><p>好了，有了contentModel和category，我们要检查某一元素是否可以作为另一元素的子元素，就可以判断一下两边是否匹配啦，首先，我们要做个索引：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>var dictionary = Object.create(null);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for(let defination of elementDefinations) {</span></span>
<span class="line"><span>  dictionary[defination.name] = defination;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们编写一下我们的check函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function check(parent, child) {</span></span>
<span class="line"><span>  for(let category of child.categories)</span></span>
<span class="line"><span>    if(parent.contentModel.categories.conatains(category))</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>  if(parent.contentModel.names.conatains(child.name))</span></span>
<span class="line"><span>      return true;</span></span>
<span class="line"><span>  return false;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>这一节课，我们完成了一个小实验：利用工具分析Web标准文本，来获得元素的信息。</p><p>通过这个实验，我希望能够传递一种思路，代码能够帮助我们从Web标准中挖掘出来很多想要的信息，编写代码的过程，也是更深入理解标准的契机。</p><p>我们前面的课程中把元素分成了几类来讲解，但是这些分类只能大概地覆盖所有的标签，我设置课程的目标也是讲解标签背后的知识，而非每一种标签的细节。具体每一种标签的属性和细节，可以留给大家自己去整理。</p><p>这一节课的产出，则是“绝对完整的标签列表”，也是我学习和阅读标准的小技巧，通过代码我们可以从不同的侧面分析标准的内容，挖掘需要注意的点，这是一种非常好的学习方法。</p>`,50)]))}const d=e(l,[["render",t]]),c=JSON.parse('{"path":"/posts/%E9%87%8D%E5%AD%A6%E5%89%8D%E7%AB%AF/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9AHTML%E5%92%8CCSS/HTML%E5%B0%8F%E5%AE%9E%E9%AA%8C%EF%BC%9A%E7%94%A8%E4%BB%A3%E7%A0%81%E5%88%86%E6%9E%90HTML%E6%A0%87%E5%87%86.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是winter。 前面的课程中，我们已经讲解了大部分的HTML标签。 然而，为了突出重点，我们还是会忽略一些标签类型。比如表单类标签和表格类标签，我认为只有少数前端工程师用过，比如我在整个手机淘宝的工作生涯中，一次表格类标签都没有用到，表单类则只用过input，也只有几次。 那么，剩下的标签我们怎么样去了解它们呢？当然是查阅HTML标准。 由于...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E9%87%8D%E5%AD%A6%E5%89%8D%E7%AB%AF/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9AHTML%E5%92%8CCSS/HTML%E5%B0%8F%E5%AE%9E%E9%AA%8C%EF%BC%9A%E7%94%A8%E4%BB%A3%E7%A0%81%E5%88%86%E6%9E%90HTML%E6%A0%87%E5%87%86.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是winter。 前面的课程中，我们已经讲解了大部分的HTML标签。 然而，为了突出重点，我们还是会忽略一些标签类型。比如表单类标签和表格类标签，我认为只有少数前端工程师用过，比如我在整个手机淘宝的工作生涯中，一次表格类标签都没有用到，表单类则只用过input，也只有几次。 那么，剩下的标签我们怎么样去了解它们呢？当然是查阅HTML标准。 由于..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":10.52,"words":3156},"filePathRelative":"posts/重学前端/模块二：HTML和CSS/HTML小实验：用代码分析HTML标准.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"HTML小实验：用代码分析HTML标准\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/a7/3f/a7864d32419da6d7e6d15a2e9f6a333f.mp3\\"></audio></p>\\n<p>你好，我是winter。</p>\\n<p>前面的课程中，我们已经讲解了大部分的HTML标签。</p>\\n<p>然而，为了突出重点，我们还是会忽略一些标签类型。比如表单类标签和表格类标签，我认为只有少数前端工程师用过，比如我在整个手机淘宝的工作生涯中，一次表格类标签都没有用到，表单类则只用过input，也只有几次。</p>","autoDesc":true}');export{d as comp,c as data};
