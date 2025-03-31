import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const p={};function l(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<p><audio id="audio" title="20｜不同文件混在一起，怎么快速分类？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/00/56/0059beae4de7cb3d406af9fb8e09fc56.mp3"></audio></p><p>你好，我是尹会生。</p><p>今天我们的内容要从一碗香喷喷的蛋炒饭开始。要想做一份传说中的蛋炒饭，肯定要放胡萝卜、黄瓜、火腿肠还有葱花等好多种类的食材。</p><p>这是不是像你的桌面一样，为了完成某一项目，需要将音频、视频、文档、图片等各种格式组合在一起。但你在你完成了项目之后，想要将它们进行整理的时候，会发现各类文件堆满了桌面，要想从桌面找都某个文件就像从蛋炒饭里将所有的葱花挑出来一样困难。</p><p>对于这种情况，我们可以采用Python按照扩展名，分门别类地整理到不同的目录，方法虽然找到了，但是在你动手写代码的时候发现也不容易，就像从蛋炒饭中把鸡蛋、米饭、胡萝卜丁、火腿肠等食材挑出来，分类型放在不同的盘子中。这无疑会让你非常头痛。</p><p>所以在今天这节课中，我就带你来学习一下，怎么用我们之前学习过的自定义函数、队列，来实现按照扩展名对文件的自动分类。</p><h2 id="批量分类的方法与思路" tabindex="-1"><a class="header-anchor" href="#批量分类的方法与思路"><span>批量分类的方法与思路</span></a></h2><p>在带你学习代码之前，我要先为你讲解一下解决这类问题的思路，因为像自动分类这种场景，可以被拆解成判断类型逻辑和移动逻辑，而这两个逻辑有前后顺序，还有前后依赖关系。这一大类问题，你在工作中会经常遇到，当你学会了这类问题的解决思路之后，再遇到同类问题，就能非常容易的想到处理逻辑，那再通过代码将你的思路实现出来，也就不在话下了。</p><p>要想实现自动分类，就要设计好<strong>分类的规则****，以及</strong>按照规则对每一个文件分类的<strong>通用模式</strong>。我们先来学习设计分类规则。</p><h3 id="怎样设计合理的数据类型" tabindex="-1"><a class="header-anchor" href="#怎样设计合理的数据类型"><span>怎样设计合理的数据类型</span></a></h3><p>分类规则是指将扩展名和要移动的目录建立对应关系，而想要保存对应关系，就必须设计一个合理的数据类型，既能保存这种对应关系，又不能太复杂，为自己编码带来困扰。由此来看，分类规则的核心就是设计合理的数据类型。</p><p>这么说，你可能有点难以理解。我先把代码提供给你，然后我来带着你分析，我们为什么要设计数据类型。代码比较长，为了让你有更好的学习效果，我把分类前和分类后的文件目录结构都提供给你。通过对照分析分类前后文件所在的目录，帮你理解自动分类代码的实现思路。</p><p>分类前的目录和文件结构如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ ls -R files</span></span>
<span class="line"><span>dir1 a.mp4 c.rm d.avi b.mp3	</span></span>
<span class="line"><span></span></span>
<span class="line"><span>files/dir1:</span></span>
<span class="line"><span>aa.exe	bb.bat</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分类后的目录和文件结构如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ ls -R files</span></span>
<span class="line"><span>dir1	execute	movie	music</span></span>
<span class="line"><span></span></span>
<span class="line"><span>files/dir1:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>files/execute:</span></span>
<span class="line"><span>aa.exe	bb.bat</span></span>
<span class="line"><span></span></span>
<span class="line"><span>files/movie:</span></span>
<span class="line"><span>a.mp4	c.rm	d.avi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>files/music:</span></span>
<span class="line"><span>b.mp3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对比分类前后的目录和文件结构，可以看到，我并没有把每一种扩展名保存在一个独立的文件夹中，而是把这些文件按照音乐、视频和可执行文件的方式进行了分类，然后再把同一类型的文件放在相同目录中。</p><p>这样的实现方式为工作中查找文件带来了便利，但是不可避免地，会增加我们编码工作的复杂度，因为你不能通过循环遍历一次文件来实现分类了。</p><p>我这么表述，你可能还不太理解它的难度具体在哪里，我们还是回到蛋炒饭的例子。如果把每个扩展名都放在一个目录中，就类似把蛋炒饭中的每种原材料都放在一个碗里。你只要准备和原材料类型相同数量的碗，去分类就好了。</p><p>而分类方式如果变成了只有三个碗，我们此时需要把材料要把主食、素菜、荤菜分别放在三个碗中，那你在遍历蛋炒饭的时候，就需要二次分类。</p><p>对于这样的需求，你在编写代码前需要设计合理的数据类型，把碗的数量和蛋炒饭的原料对应关系事先确定好。而确定的这一对应关系在编程语言中就被称作设计数据类型。</p><p>那怎样来设计合理的数据类型呢？让我们来看看文件自动分类中的“碗和原材料”。</p><p>文件自动分类功能中的“碗”是多个文件夹。但是在Python中，表示多个文件夹的时候，我们会采用字符串，方便和文件夹名称建立对应关系。而且你还可以通过创建文件夹的库，把字符串作为文件夹名字，实现字符串到文件夹的对应关系。</p><p>文件自动分类功能中的“原材料”是扩展名。扩展名也要使用字符串类型。那么每组文件夹到扩展名对应关系都是一个字符串对应多个字符串，相信你一定想到了这种对应关系应该使用字典保存它们的映射关系了吧，那作为字典值的多个扩展名，由于在运行程序前指定好就不会再修改了，所以我将扩展名字符串组成元组，将元组作为字典的值。</p><p>那么根据我们的分析，我把扩展名和文件类型定义为如下字典，如果你的工作场景使用到了更多的扩展名，或者使用了和我不同的分类，也可以修改这个字典。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># 定义文件类型和它的扩展名</span></span>
<span class="line"><span>file_type = {</span></span>
<span class="line"><span>    &amp;quot;music&amp;quot;: (&amp;quot;mp3&amp;quot;, &amp;quot;wav&amp;quot;),</span></span>
<span class="line"><span>    &amp;quot;movie&amp;quot;: (&amp;quot;mp4&amp;quot;, &amp;quot;rmvb&amp;quot;, &amp;quot;rm&amp;quot;, &amp;quot;avi&amp;quot;),</span></span>
<span class="line"><span>    &amp;quot;execute&amp;quot;: (&amp;quot;exe&amp;quot;, &amp;quot;bat&amp;quot;)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过刚才对字典的定义，我们给扩展名自动分类制定好了分类的规则。那接下来我们继续设计程序，按照这一分类规则，进行文件的读取和分类。</p><h3 id="怎样设计生产者消费者模式" tabindex="-1"><a class="header-anchor" href="#怎样设计生产者消费者模式"><span>怎样设计生产者消费者模式</span></a></h3><p><strong>文件的读取和分类</strong>是两个不同的功能，你在编写代码时可以把它们编写成两个不同的函数。</p><p>但是由于今天的程序比以往要复杂，所以实现这两个函数的思路也会比较多。比如：</p><ul><li>你可以把所有的文件全部读取之后，再按照分类规则移动到新的目录；</li><li>也可以读取一个紧接着将它移动到一个新的文件夹里；</li><li>当然还可以读取一部分文件之后，将一部分文件进行移动，然后继续读取第二批文件。</li></ul><p>到底选择哪种方案才是最佳实践呢？</p><p>在这种情况下，你最希望的是能够向有丰富开发经验的开发人员请教，看他是怎么实现类似需求的，然后按照他的实现逻辑来编写你的代码。这也是专业软件开发人员面对这一问题时的通常做法：去寻找和当前场景相似的“设计模式”。因为设计模式是众多软件开发人员经过相当长的时间，对某一场景进行大量试错总结出来的经验。那我们可以利用它，来解决我们当前场景下的问题。</p><p>我们当前的场景刚好和设计模式中的“生产者消费者模式”比较吻合。生产者消费者模式的描述是这样的：有两个进程共用一个缓冲区，两个进程分别是生产数据和消费数据的。而缓冲区，用于存放生产进程产生的数据，并让消费进程从缓冲区读取数据进行消费。</p><p>使用生产者消费者模式刚好能解决文件读取和文件分离的逻辑。我把读取当前文件名称和路径函数作为生产者，把分类和移动文件的逻辑作为消费者。在生产者消费者中间，我再使用队列作为它们中间的缓冲区。</p><p>可以看到，使用生产消费者模式，我主要是增加了一个队列，而不是从生产者直接把数据交给消费者。这样做主要有三个好处：</p><ol><li>如果生产者比消费者快，可以把多余的生产数据放在缓冲区中，确保生产者可以继续生产数据。</li><li>如果生产者比消费者慢，消费者处理完缓冲区中所有数据后，会自动进入到阻塞状态，等待继续处理任务。</li><li>缓冲区会被设置为一定的大小，当生产者的速度远远超过消费者，生产者数据填满缓冲区后，生产者也会进入到阻塞状态，直到缓冲区中的数据被消费后，生产者才可以继续写入。而当消费性能不足时，可以等待消费者运行，减少生产者和消费者在进度上相互依赖的情况。</li></ol><p>通过分析我们发现，可以采用生产者消费者模式来编写文件的读取和分类代码。</p><p>考虑到是你初次接触设计模式，为了不让你产生较大的学习心理负担，我把其中的多线程并发访问缓冲区简化成单线程版本，这样你能根据代码的执行过程，先学会简单的生产者和消费者模式。</p><p>在分类规则的“file_type”字典之后，我增加了以下代码，实现了单线程版本的生产者消费者设计模式。如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>from queue import Queue</span></span>
<span class="line"><span># 建立新的文件夹</span></span>
<span class="line"><span>make_new_dir(source_dir, file_type)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 定义一个用于记录扩展名放在指定目录的队列</span></span>
<span class="line"><span>filename_q = Queue()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 遍历目录并存入队列</span></span>
<span class="line"><span>write_to_q(source_dir, filename_q)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将队列的文件名分类并写入新的文件夹</span></span>
<span class="line"><span>classify_from_q(filename_q， file_type)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码实现了从定义队列到文件处理的完整函数调用。在后续（第22节、28节）我为你讲完面向对象、类和多线程后，我会带你再实现一个多线程版本的生产者消费者模型，让你完全掌握这一设计模式，并应用到更多的场景中。</p><p>在确定了分类规则用到的数据模型，以及分类流程用到的设计模式之后，接下来就到了具体实现代码的环节了。</p><p>在生产者消费模式下，我通过定义三个函数来分别实现三个功能，如下：</p><ul><li>定义函数make_new_dir()，实现新建分类文件夹的功能；</li><li>定义函数write_to_q()，实现写入当前文件路径到队列的功能；</li><li>定义函数classify_from_q()，实现把队列中的文件分类并移动的功能。</li></ul><p>接下来，我带你依次学习一下它们各自的实现代码。</p><h2 id="如何实现分类" tabindex="-1"><a class="header-anchor" href="#如何实现分类"><span>如何实现分类</span></a></h2><p>要想实现分类，首先要先创建分类需要的文件夹。这里需要注意，创建文件夹的操作要在批量分类前完成，否则在每次移动文件前，你还得对要移动的文件夹进行判断，这会影响程序的运行效率。</p><p>我们来看一下怎样利用分类规则的字典“file_type”，以及make_new_dir()函数来批量分类文件夹。</p><h3 id="如何建立分类文件夹" tabindex="-1"><a class="header-anchor" href="#如何建立分类文件夹"><span>如何建立分类文件夹</span></a></h3><p>批量建立文件夹操作的前提是建立哪几个文件夹，以及在哪个目录下建立它。基于这样的考虑，我为make_new_dir()函数增加了两个参数：</p><ol><li>使用dir指定建立文件夹的目录；</li><li>使用type_dir指定按照哪个字典建立。</li></ol><p>而建立文件夹，可以使用我们学习过的os模块，通过os.mkdirs()函数建立一个新的文件夹。代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import os</span></span>
<span class="line"><span># 定义文件类型和它的扩展名</span></span>
<span class="line"><span>file_type = {</span></span>
<span class="line"><span>    &amp;quot;music&amp;quot;: (&amp;quot;mp3&amp;quot;, &amp;quot;wav&amp;quot;),</span></span>
<span class="line"><span>    &amp;quot;movie&amp;quot;: (&amp;quot;mp4&amp;quot;, &amp;quot;rmvb&amp;quot;, &amp;quot;rm&amp;quot;, &amp;quot;avi&amp;quot;),</span></span>
<span class="line"><span>    &amp;quot;execute&amp;quot;: (&amp;quot;exe&amp;quot;, &amp;quot;bat&amp;quot;)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>source_dir = &amp;quot;/Users/user1/Desktop/files</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def make_new_dir(dir, type_dir):</span></span>
<span class="line"><span>    for td in type_dir:</span></span>
<span class="line"><span>        new_td = os.path.join(dir, td)</span></span>
<span class="line"><span>        if not os.path.isdir(new_td):</span></span>
<span class="line"><span>            os.makedirs(new_td)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 建立新的文件夹</span></span>
<span class="line"><span>make_new_dir(source_dir, file_type)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码把字典的key作为文件夹名称，通过遍历字典来批量创建文件夹。这里还有两个你需要注意的技巧。</p><p>第一个是文件路径的拼接。代码中要新建的文件夹路径，是由“source_dir”和遍历字典得到的“字典的key”两部分连接组成的。如果你使用字符串的连接函数“join()”函数来连接这两部分，你需要增加路径连接符号&quot;/&quot;，而如果你的操作系统从mac换成windows，则需要使用反斜线&quot;&quot;，这时候你就要再修改代码，把斜线改为正确的路径分隔符。</p><p>因此我采用了“os.path.join()”函数，这个函数会自动判断操作系统并增加斜线&quot;/&quot;，它还避免了你为已经有“/”的路径重复添加的问题。</p><p>另一个小技巧是判断目录是否存在。我在创建目录前，使用了os.path.isdir()函数，判断了目录是否存在，这样做的好处是避免重复创建目录。</p><p>另外，我还想教给你和它功能相近的两个函数，它们分别是os.path.isfile()和os.path.isexist()。</p><ul><li>前者用来判断该路径是否存在，并且是否是同一个文件类型。</li><li>后者用来判断路径是否存在，并且这个路径可以是文件也可以是目录。</li></ul><p>结合代码中出现的isdir()函数，你就可以对一个目录到底是文件还是目录，以及是否存在进行判断了。</p><p>创建目录之后，我们就要开始对当前的文件进行遍历，并存入缓冲区中。</p><h3 id="怎样遍历目录并写入队列" tabindex="-1"><a class="header-anchor" href="#怎样遍历目录并写入队列"><span>怎样遍历目录并写入队列</span></a></h3><p>我先把遍历目录的代码写在下面，然后再为你详细讲解它。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>from queue import Queue</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 遍历目录并存入队列</span></span>
<span class="line"><span>def write_to_q(path_to_write, q: Queue):</span></span>
<span class="line"><span>    for full_path, dirs, files in os.walk(path_to_write):</span></span>
<span class="line"><span>        # 如果目录下没有文件，就跳过该目录</span></span>
<span class="line"><span>        if not files:</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            q.put(f&amp;quot;{full_path}::{files}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#########</span></span>
<span class="line"><span>source_dir = &amp;quot;/Users/user1/Desktop/files</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 定义一个用于记录扩展名放在指定目录的队列</span></span>
<span class="line"><span>filename_q = Queue()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 遍历目录并存入队列</span></span>
<span class="line"><span>write_to_q(source_dir, filename_q)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码实现了定义队列，并把指定目录下所有的文件名称和路径写入到队列中的功能。在这里有两个关键的知识点需要你掌握，它们分别是如何遍历目录，以及如何写入队列。</p><p>先来看如何遍历目录的函数。它在代码的第5行，叫做os.walk()函数，和之前我们学习过的pathlib()函数一样，都能实现对目录的遍历，但是它的返回值值得你学习一下。</p><p>我使用for循环遍历walk()函时，分别使用了full_path、dirs和files三个变量，因此walk()函数的返回值有三个。这三个变量分别对应每次遍历的文件的完整路径、文件所在的目录，以及该目录下所有文件名称的列表。</p><p>你可以根据你的工作场景灵活组合这三个变量，由于我在移动的场景需要文件的完整路径和文件名，所以我只使用了第一个参数full_path和第三个参数files。</p><p>此外，我在实现遍历时，也像创建目录一样增加了容错。如果某一目录下没有文件，就不需要对该目录进行移动了，所以我使用了“if not files” 来判断files列表的值。</p><p>由于我增加了not关键字，if的判断条件就从列表中包含文件，变成了列表中没包含任何一个文件。当条件成立时，则执行continue语句，跳过当前这次循环。而else语句中，是当files列表中包含了文件名称的处理过程，在这种情况下，我会将文件的完整路径和该路径下的文件列表放到缓冲区中。</p><p>在当前代码，我把队列这一数据类型作为缓冲区，它和我们之前学习过的多进程通信的队列功能和用法完全相同，区别则是我们导入的库名称不同。</p><p>要想把对象存入队列，可以使用put()函数。从队列取出数据，则可以使用get()函数。我把循环遍历得到的路径和文件名称均使用了put()函数存放到队列中，实现了生产者这一角色。</p><p>接下来，我们来学习消费者这一角色实现的代码，学习如何实现分类并将文件移动到新的文件夹的。</p><h3 id="分类并移动到新的文件夹" tabindex="-1"><a class="header-anchor" href="#分类并移动到新的文件夹"><span>分类并移动到新的文件夹</span></a></h3><p>同样的，我先把代码写在下面，然后再为你详细分析如何实现从队列取出文件名并进行分类的功能。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># 移动文件到新的目录</span></span>
<span class="line"><span>def move_to_newdir(filename_withext, file_in_path, type_to_newpath):</span></span>
<span class="line"><span>    # 取得文件的扩展名</span></span>
<span class="line"><span>    filename_withext = filename_withext.strip(&amp;quot; \\&#39;&amp;quot;)</span></span>
<span class="line"><span>    ext = filename_withext.split(&amp;quot;.&amp;quot;)[1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for new_path in type_to_newpath:</span></span>
<span class="line"><span>        if ext in type_to_newpath[new_path]:</span></span>
<span class="line"><span>            oldfile = os.path.join(file_in_path, filename_withext)</span></span>
<span class="line"><span>            newfile = os.path.join(source_dir, new_path, filename_withext)</span></span>
<span class="line"><span>            shutil.move(oldfile, newfile)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将队列的文件名分类并写入新的文件夹</span></span>
<span class="line"><span>def classify_from_q(q: Queue, type_to_classify):</span></span>
<span class="line"><span>    while not q.empty():</span></span>
<span class="line"><span>        # 从队列里取目录和文件名</span></span>
<span class="line"><span>        item = q.get()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 将路径和文件分开</span></span>
<span class="line"><span>        filepath, files = item.split(&amp;quot;::&amp;quot;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 剔除文件名字符串出现的&amp;quot;[&amp;quot; &amp;quot;]&amp;quot;,并用&amp;quot;，&amp;quot;做分隔转换为列表</span></span>
<span class="line"><span>        files = files.strip(&amp;quot;[]&amp;quot;).split(&amp;quot;,&amp;quot;)</span></span>
<span class="line"><span>        # 对每个文件进行处理</span></span>
<span class="line"><span>        for filename in files:</span></span>
<span class="line"><span>            # 将文件移动到新的目录</span></span>
<span class="line"><span>            move_to_newdir(filename, filepath, type_to_classify)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段代码中，我实现了从队列取出文件名称和目录，并根据分类将文件移动到新的目录。</p><p>由于消费者的逻辑是从队列读取内容和移动文件两个功能组成的，所以我把消费者拆分成了两个函数进行编写：</p><ol><li>classify_from_q()函数，用来实现从队列读取文件列表，并遍历列表，得到每一个文件名称；</li><li>move_to_newdir()函数，把文件名称、路径、分类规则作为参数，真正实现移动。</li></ol><p>相应的，如果你在编写包含多个功能的程序时，也要尽量保持每个功能的独立性，把每一个功能尽量放在一个函数中，这样能有效提升你的代码的可读性。</p><p>这两个函数虽然比较长，但是大部分都是我们学过的内容，我想为你重点讲解一下第一次接触到的两个知识点，一个是in操作，一个是利用shutil库的move()函数实现的重命名。</p><p>in操作叫做成员操作符，它能支持目前我们学习过的所有基础数据类型，用来判断一个值是否是列表、元组、字典等基础数据类型中的一员。如果这个值是基础类型的成员之一就会直接返回True，如果不是成员之一返回的就是False。有了in操作符，你就不用手动遍历基础数据类型，再使用“==”逐个去判断某个值和数据类型中的成员是否相等了。</p><p>我举个例子，你会更容易理解。我在代码中使用了这样一行代码：“if ext in type_to_newpath[new_path]” ：</p><ul><li>“ext” 就是文件的扩展名，就像是“a.mp3”的扩展名是“mp3”；</li></ul><li>“type_to_newpath[new_path]”是字典“type_to_newpath”中，以“new_path”作为key的值，就像是“type_to_newpath = { &quot;music&quot;: (&quot;mp3&quot;, &quot;wav&quot;) }”的“(&quot;mp3&quot;, &quot;wav&quot;)”。<br> 我把变量改成具体的变量值，那这行代码就变成了下面的样子：</li><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;quot;mp3&amp;quot; in (&amp;quot;mp3&amp;quot;, &amp;quot;wav&amp;quot;)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果扩展名在元组中，那么if条件的返回结果就是True，就可以进行文件的移动了，如果结果是False则从字典中继续取下一个key，直到所有的key遍历完成之后，仍然没有匹配的扩展名，就把文件保持在原地，不做任何移动操作。</p><p>还有一个我们第一次接触到的函数是shutil库的move()函数，这个函数是直接对系统上的文件进行操作的，所以你需要注意移动以后的文件名不要和已有的文件名冲突，这样会导致重名覆盖已有的文件，从而丢失文件。因此在你没有十足的把握之前，建议你在移动前增加一个判断功能，判断移动的文件是否存在，如果存在则提示使用脚本的人此情况，或移动前将文件进行改名。</p><p>以上就是如何对混在一起的多个扩展名的文件，进行自动分类的完整过程。这节课的完整代码比较长，我一并贴在了下方，帮你理解多个函数之间的调用关系和执行顺序。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import os</span></span>
<span class="line"><span>import shutil</span></span>
<span class="line"><span>from queue import Queue</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 建立新的目录</span></span>
<span class="line"><span>def make_new_dir(dir, type_dir):</span></span>
<span class="line"><span>    for td in type_dir:</span></span>
<span class="line"><span>        new_td = os.path.join(dir, td)</span></span>
<span class="line"><span>        if not os.path.isdir(new_td):</span></span>
<span class="line"><span>            os.makedirs(new_td)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 遍历目录并存入队列</span></span>
<span class="line"><span>def write_to_q(path_to_write, q: Queue):</span></span>
<span class="line"><span>    for full_path, dirs, files in os.walk(path_to_write):</span></span>
<span class="line"><span>        # 如果目录下没有文件，就跳过该目录</span></span>
<span class="line"><span>        if not files:</span></span>
<span class="line"><span>            continue</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            q.put(f&amp;quot;{full_path}::{files}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 移动文件到新的目录</span></span>
<span class="line"><span>def move_to_newdir(filename_withext, file_in_path, type_to_newpath):</span></span>
<span class="line"><span>    # 取得文件的扩展名</span></span>
<span class="line"><span>    filename_withext = filename_withext.strip(&amp;quot; \\&#39;&amp;quot;)</span></span>
<span class="line"><span>    ext = filename_withext.split(&amp;quot;.&amp;quot;)[1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for new_path in type_to_newpath:</span></span>
<span class="line"><span>        if ext in type_to_newpath[new_path]:</span></span>
<span class="line"><span>            oldfile = os.path.join(file_in_path, filename_withext)</span></span>
<span class="line"><span>            newfile = os.path.join(source_dir, new_path, filename_withext)</span></span>
<span class="line"><span>            shutil.move(oldfile, newfile)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将队列的文件名分类并写入新的文件夹</span></span>
<span class="line"><span>def classify_from_q(q: Queue, type_to_classify):</span></span>
<span class="line"><span>    while not q.empty():</span></span>
<span class="line"><span>        item = q.get()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 将路径和文件分开</span></span>
<span class="line"><span>        filepath, files = item.split(&amp;quot;::&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        files = files.strip(&amp;quot;[]&amp;quot;).split(&amp;quot;,&amp;quot;)</span></span>
<span class="line"><span>        # 对每个文件进行处理</span></span>
<span class="line"><span>        for filename in files:</span></span>
<span class="line"><span>            # 将文件移动到新的目录</span></span>
<span class="line"><span>            move_to_newdir(filename, filepath, type_to_classify)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &amp;quot;__main__&amp;quot;:</span></span>
<span class="line"><span>    # 定义要对哪个目录进行文件扩展名分类</span></span>
<span class="line"><span>    source_dir = &amp;quot;/Users/edz/Desktop/files&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 定义文件类型和它的扩展名</span></span>
<span class="line"><span>    file_type = {</span></span>
<span class="line"><span>        &amp;quot;music&amp;quot;: (&amp;quot;mp3&amp;quot;, &amp;quot;wav&amp;quot;),</span></span>
<span class="line"><span>        &amp;quot;movie&amp;quot;: (&amp;quot;mp4&amp;quot;, &amp;quot;rmvb&amp;quot;, &amp;quot;rm&amp;quot;, &amp;quot;avi&amp;quot;),</span></span>
<span class="line"><span>        &amp;quot;execute&amp;quot;: (&amp;quot;exe&amp;quot;, &amp;quot;bat&amp;quot;)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 建立新的文件夹</span></span>
<span class="line"><span>    make_new_dir(source_dir, file_type)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 定义一个用于记录扩展名放在指定目录的队列</span></span>
<span class="line"><span>    filename_q = Queue()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 遍历目录并存入队列</span></span>
<span class="line"><span>    write_to_q(source_dir, filename_q)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 将队列的文件名分类并写入新的文件夹</span></span>
<span class="line"><span>    classify_from_q(filename_q, file_type)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>最后让我来为你做个总结，实现文件自动分类是目前我们编写代码量最多的一讲。面对功能复杂、代码量增多时，你就需要通过函数设计合理的功能封装，还要考虑如何使用参数进行函数的通信。</p><p>当你的多个函数之间的工作流程也可以进行多种组合时，你可以借助开发高手的代码经验--设计模式，来实现工作逻辑上的函数组合。在本讲中我为你介绍的这种普遍应用于产品生产、销售的生产者消费者模式就是设计模式中最常用的一种。</p><p>希望你能在掌握如何使用Python提高工作效率的同时也能掌握设计模式、函数这些编写Python的思路。这样，你在面对更庞大的需求时，也会更快地设计出结构清晰、逻辑清楚的代码。高效编程也是高效办公的一部分！</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>我来为你留一道思考题，如果我按照文件的大小对文件分成三类，将“大于1GB”“1GB到100MB”“小于100MB”三类的文件名和大小，依次显示在屏幕上，你会怎样实现呢？</p>`,97)]))}const r=n(p,[["render",l]]),m=JSON.parse('{"path":"/posts/Python%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%9E%E5%85%AC%E5%AE%9E%E6%88%98%E8%AF%BE/%E2%80%9C%E5%AD%98%E5%82%A8%E2%80%9D%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%92%8C%E6%96%87%E4%BB%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C/20%EF%BD%9C%E4%B8%8D%E5%90%8C%E6%96%87%E4%BB%B6%E6%B7%B7%E5%9C%A8%E4%B8%80%E8%B5%B7%EF%BC%8C%E6%80%8E%E4%B9%88%E5%BF%AB%E9%80%9F%E5%88%86%E7%B1%BB%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是尹会生。 今天我们的内容要从一碗香喷喷的蛋炒饭开始。要想做一份传说中的蛋炒饭，肯定要放胡萝卜、黄瓜、火腿肠还有葱花等好多种类的食材。 这是不是像你的桌面一样，为了完成某一项目，需要将音频、视频、文档、图片等各种格式组合在一起。但你在你完成了项目之后，想要将它们进行整理的时候，会发现各类文件堆满了桌面，要想从桌面找都某个文件就像从蛋炒饭里将所有...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Python%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%9E%E5%85%AC%E5%AE%9E%E6%88%98%E8%AF%BE/%E2%80%9C%E5%AD%98%E5%82%A8%E2%80%9D%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%92%8C%E6%96%87%E4%BB%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C/20%EF%BD%9C%E4%B8%8D%E5%90%8C%E6%96%87%E4%BB%B6%E6%B7%B7%E5%9C%A8%E4%B8%80%E8%B5%B7%EF%BC%8C%E6%80%8E%E4%B9%88%E5%BF%AB%E9%80%9F%E5%88%86%E7%B1%BB%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是尹会生。 今天我们的内容要从一碗香喷喷的蛋炒饭开始。要想做一份传说中的蛋炒饭，肯定要放胡萝卜、黄瓜、火腿肠还有葱花等好多种类的食材。 这是不是像你的桌面一样，为了完成某一项目，需要将音频、视频、文档、图片等各种格式组合在一起。但你在你完成了项目之后，想要将它们进行整理的时候，会发现各类文件堆满了桌面，要想从桌面找都某个文件就像从蛋炒饭里将所有..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":20.38,"words":6113},"filePathRelative":"posts/Python自动化办公实战课/“存储”模块：和文件相关的常用操作/20｜不同文件混在一起，怎么快速分类？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"20｜不同文件混在一起，怎么快速分类？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/00/56/0059beae4de7cb3d406af9fb8e09fc56.mp3\\"></audio></p>\\n<p>你好，我是尹会生。</p>\\n<p>今天我们的内容要从一碗香喷喷的蛋炒饭开始。要想做一份传说中的蛋炒饭，肯定要放胡萝卜、黄瓜、火腿肠还有葱花等好多种类的食材。</p>\\n<p>这是不是像你的桌面一样，为了完成某一项目，需要将音频、视频、文档、图片等各种格式组合在一起。但你在你完成了项目之后，想要将它们进行整理的时候，会发现各类文件堆满了桌面，要想从桌面找都某个文件就像从蛋炒饭里将所有的葱花挑出来一样困难。</p>","autoDesc":true}');export{r as comp,m as data};
