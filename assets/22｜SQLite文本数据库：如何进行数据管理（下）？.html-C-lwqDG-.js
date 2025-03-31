import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(t,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_22-sqlite文本数据库-如何进行数据管理-下" tabindex="-1"><a class="header-anchor" href="#_22-sqlite文本数据库-如何进行数据管理-下"><span>22｜SQLite文本数据库：如何进行数据管理（下）？</span></a></h1><p><audio id="audio" title="22｜SQLite文本数据库：如何进行数据管理（下）？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/d3/70/d3c634ceb8b32dfbfb9886c95f3d7070.mp3"></audio></p><p>你好，我是尹会生。</p><p>在上节课，我提到了使用比较简单的SQL来操作SQLite，并为你讲解了数据库的基本操作步骤。</p><p>不过当你的程序功能越来越强大的时候，随之而来的就是代码的复杂度越来越高。像是上一讲，我们在进行SQLite数据库搜索的时候，你需要建立连接、申请游标对象，才能进行查询。而这些准备工作，我们更希望在程序运行的时候就准备好，这样就不必多次重复编写。</p><p>而且对数据库进行增删改查能够通过尽可能少的SQL来实现数据库的操作。那么能实现这一功能的就是<strong>类</strong>。</p><p>通过类，你可以为越来越复杂的程序编写结构更清晰的代码。同时也能更好地把SQLite的增删改查封装成一个独立的对象，便于你调用数据库时能进行数据持久化。</p><p>那么今天这节课，我就带你使用类来实现SQLite数据的读取和写入。与此同时，我会继续以通讯录为例，来给你讲解，如果使用了比较复杂的SQL来操作SQLite时，怎么合理组织代码结构，让你更优雅地书写代码。</p><h2 id="使用类实现sqlite的读写" tabindex="-1"><a class="header-anchor" href="#使用类实现sqlite的读写"><span><strong>使用类实现SQLite的读写</strong></span></a></h2><p>由于类这个概念比较抽象，我还是采用老办法帮你理解它，我将使用“类”对SQLite的读写SQL操作进行封装，并将类进行实例化以后进行调用，得到SQLite中的通讯录数据。我先把代码贴出来，供你参考：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import sqlite3</span></span>
<span class="line"><span>import pathlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class OptSqlite(object):</span></span>
<span class="line"><span>    def __init__(self, dbname = &amp;quot;new.db&amp;quot;):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        :param dbname  数据库名称</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.dir = pathlib.PurePath(__file__).parent</span></span>
<span class="line"><span>        self.db = pathlib.PurePath(self.dir, dbname)</span></span>
<span class="line"><span>        self.conn = sqlite3.connect(self.db)</span></span>
<span class="line"><span>        self.cur = self.conn.cursor()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def close(self):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        关闭连接</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.cur.close()</span></span>
<span class="line"><span>        self.conn.close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def get_one_phone(self, username):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        获取一个联系人的电话</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self.get_user_phone_sql = f&amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>            SELECT phone FROM address_book WHERE name = &amp;quot;{username}&amp;quot; &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.result = self.cur.execute(self.get_user_phone_sql)</span></span>
<span class="line"><span>            return self.result.fetchone()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&amp;quot;失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def set_one_phone(self, name, phone):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        增加一个联系人</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.set_user_phone_sql = &#39;&#39;&#39;INSERT INTO address_book</span></span>
<span class="line"><span>          VALUES (?, ?, ?)&#39;&#39;&#39;</span></span>
<span class="line"><span>        self.v =  (2, str(name), int(phone))</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.cur.execute(self.set_user_phone_sql, self.v)</span></span>
<span class="line"><span>            self.conn.commit()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&amp;quot;失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &amp;quot;__main__&amp;quot;:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    my_query = OptSqlite(&amp;quot;contents.db&amp;quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    my_query.set_one_phone(&amp;quot;Jerry&amp;quot;,&amp;quot;12344445555&amp;quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    phone = my_query.get_one_phone(&amp;quot;Tom&amp;quot;)</span></span>
<span class="line"><span>    phone2 = my_query.get_one_phone(&amp;quot;Jerry&amp;quot;)    </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    my_query.close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print(phone)</span></span>
<span class="line"><span>    print(phone2)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出结果</span></span>
<span class="line"><span># (12377778888,)</span></span>
<span class="line"><span># (12344445555,)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段代码中，我使用类实现了两个连续操作：添加新的联系人“Jerry”，并取出联系人“Tom”和“Jerry”的手机号码。</p><p>通过代码，你会发现类的实现思路和语法，跟函数有非常大的区别，因此在你第一次使用类代替函数实现通讯录时，我要通过实现方式和语法方面来为你做个详细的对比，并且为你讲解类的初始化函数，在类实例化时是如何实现接收参数并自动初始化的。</p><p>总体来说，与使用函数实现数据库操作相比，类的最大优势就是完善的封装。</p><p>在使用类实现“SELECT”和“INSERT”这两个SQL操作的时候，你只需进行了一次初始化和关闭连接，后续的SQL操作都可以复用这次的连接，类能有效减少重复建立连接和重复初始化的工作。</p><p>因此在类似数据库封装这种功能复杂的代码中，你会看到更多的人选择用类代替自定义函数，实现开发需求。</p><p>从具体来讲，对比函数，类除了在封装方式上不同、语法和调用方式都不相同，我还是基于通讯录代码的封装和调用，为你讲解一下它和自定义函数的三个主要区别。</p><h3 id="类和自定义函数的区别" tabindex="-1"><a class="header-anchor" href="#类和自定义函数的区别"><span><strong>类和自定义函数的区别</strong></span></a></h3><p><strong>首先，类和函数第一点区别就在于它们的对代码的封装方式上不同。</strong></p><p>编写自定义函数，它的实现思路是通过函数去描述程序运行的过程，比如：代码的下一步需要做什么、需要什么参数。</p><p>而编写基于类的程序，它的实现思路更多要关注<strong>相同的一类数据</strong>，都有哪些属性和相同的动作。比如在代码中，我把数据库作为了一个类，因为类具有数据库名称这一属性，也具有查询和写入数据两个动作。而类在语法层面上，对属性和动作的封装要比函数更加完善。</p><p>在我工作中对建立数据库连接，以及执行查询、关闭数据库连接上都做过运行时间的测试，最终得出的结论是频繁地建立、关闭会给数据库带来较大的资源开销。因此，我在工作中会经常使用类把建立连接和关闭分别封装在多个查询动作之前和之后，确保这两个动作在多次查询时只执行一次，减少资源开销。</p><p><strong>其次它们的语法结构也不同</strong>。函数是通过“def”关键字定义的，而类是通过“class”关键字定义的。</p><p>在编写一个新的类时，Python语法还强制要求它必须继承父类，例如，我在编写的数据库类“OptSqlite”，就继承了父类“object”。继承父类意味这你可以在当前类中执行父类定义过的方法，而不需要再重新去编写一个定义过的方法。那如果你不需要继承其他类呢？这时候你就可以使用object作为你自定义类的父类使用。</p><p>同时，object的关键字可以和定义类语法的“()”一起省略掉，因此你会看到其他人的代码出现，会有下面两种不同的写法，但含义却(在Python3.x版本)是完全相同的。我将两种写法写在下面供你参考。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class OptSqlite(object):</span></span>
<span class="line"><span>class OptSqlite:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>最后它们的调用方式也不同</strong>。这一点主要表现在各自成员能否被访问和运行方式两方面。</p><p>类的定义中，可以定义当前类的属性和方法。属性就是类具有的数据状态，方法就是类对数据可以执行哪些操作。</p><p>在类中，可以设置哪些属性和方法能够被类以外的代码访问到，比如：我定一个了“鸟”类。并且定义了它的属性是黄色，它的动作是可以飞、可以叫。那么你可以借用变量这种形式来实现鸟类的属性，借用函数的形式实现鸟类能飞、能叫的动作。</p><p>此外，在定义属性和方法时，你还能限制它们的访问范围。像函数的调用，你只能访问它的函数名称和参数、中间的变量是不能被函数外的程序访问的。</p><p>是否能访问，在计算机中也被称作作用范围。在这一方面，类要比函数拥有更灵活的作用范围控制。</p><p>那在执行方式，类也和函数不同。函数执行时可以直接使用函数名+括号的方式调用它，如果需要多次执行可以使用变量存放多次执行的结果。</p><p>而类在执行时，一般要进行实例化。例如鸟类，在需要使用时，会实例化为一个对象“鸟001”，对象就具有类的所有属性和方法。当你需要多次使用鸟类时，可以多次将鸟类实例化成不同的小鸟。</p><p>再回到通讯录的代码。类似的在通讯录的代码中，我将SQLite数据库定义为类以后，如果你的工作需要一个通讯录，就实例化一次。实例化之后的代码我单独拎了出来，如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>my_query = OptSqlite(&amp;quot;contents.db&amp;quot;)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果需要多个通讯录，就把它实例化多次，并指定不同的SQLite数据库即可。每个数据库实例，都会有一个“get_one_phone()”方法和一个“set_one_phone()”方法，来实现通讯录中联系人的读取和写入。</p><p>而为了表示属性和方法是在实例化中使用的，你还需要对它增加self关键字，即：使用实例的属性时，要用“self.属性”的写法。使用方法时，要是将实例的方法第一个参数设置为self，代码为“方法(self)”。</p><p>类能够在封装和调用上提供比函数更灵活的方式，因此你会发现当功能复杂，代码数量增多了以后，很多软件都采用了类方式实现代码的设计。</p><h3 id="类中的特殊方法-init" tabindex="-1"><a class="header-anchor" href="#类中的特殊方法-init"><span><strong>类中的特殊方法“<strong>init</strong>”</strong></span></a></h3><p>在类中，有一个内置的方法叫做“<strong>init</strong>”,它叫做类的初始化方法，能实现类在执行的时候接收参数，还能为类预先执行变量赋值、初始化等，实现在类一运行就需要完成的工作。</p><p>“<strong>init</strong>()”方法的作用有两个，分别是：</p><ol><li>为实例接收参数；</li><li>实例化时立即运行该方法中的代码。</li></ol><p>当一个类实例化时，它可以像函数调用一样，接收参数。类实例化时，它的后面需要增加括号“()”，括号中可以指定实例化的参数。这个参数将交给“<strong>init</strong>()”方法，作为“<strong>init</strong>()”方法的参数，进行使用。</p><p>我来为你举个例子，来说明类是如何实现接收参数的。例如我在通讯录的例子中，实例化一个SQLite的“OptSqlite”类，实例化的代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>my_query = OptSqlite(&amp;quot;contents.db&amp;quot;)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这段代码中的“OptSqlite”就是类的名称，而“contents.db”是该类初始化时，输入的参数，也是SQLite数据库文件的名称。</p><p>要想实现“my_query”实例在“OptSqlite”类实例化时获得参数，就需要在类中使用初始化方法：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>def __init__(self, dbname = &amp;quot;new.db&amp;quot;):</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>在这段代码中，我定义了“<strong>init</strong>()”方法，并指定它的参数“dbname”之后，那么实例“my_query”就能够得到参数dbname变量的值“contents.db”了。</p><p>这就是一个实例化一个类，并如何在第一时间获得参数的完整过程。不过获得参数之后，你还要对参数继续使用和处理，以及需要在实例化之后就立即运行一些代码，这些功能就可以写在“<strong>init</strong>()”方法中来实现。</p><p>例如我就将数据库文件的路径处理、初始化连接、初始化游标的代码写入到了初始化函数。代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class OptSqlite(object):</span></span>
<span class="line"><span>    def __init__(self, dbname = &amp;quot;new.db&amp;quot;):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        :param dbname  数据库名称</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.dir = pathlib.PurePath(__file__).parent</span></span>
<span class="line"><span>        self.db = pathlib.PurePath(self.dir, dbname)</span></span>
<span class="line"><span>        self.conn = sqlite3.connect(self.db)</span></span>
<span class="line"><span>        self.cur = self.conn.cursor()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过上面的写法，实例不但能够接受参数，还能在初始化时做很多主要逻辑前的预备操作。这些初始化操作让实例被调用时的主要逻辑更加清晰。</p><p>为了能够让你对类有更深刻的理解，也为了能让你将数据库的代码直接拿来在工作中使用，我们在对数据库的写入和读取基础上，再增加修改和删除功能，这样，SQLite的类就能完整实现数据库的增删改查功能了。</p><h2 id="使用类实现完整的sqlite增删改查" tabindex="-1"><a class="header-anchor" href="#使用类实现完整的sqlite增删改查"><span><strong>使用类实现完整的SQLite增删改查</strong></span></a></h2><p>SQLite的增删改查，都需要依赖SQL语句完成，在编写代码前，我们先来学习一些更新和删除的SQL，在掌握增删改查SQL基础上，你会更好地理解我编写操作SQLite类的代码逻辑。</p><h3 id="更新和删除记录的sql语句" tabindex="-1"><a class="header-anchor" href="#更新和删除记录的sql语句"><span>更新和删除记录的SQL语句</span></a></h3><p>首先，我先来带你学习一些更新的SQL语句。更新一般是对单个记录进行操作，因此更新的SQL语句会带有筛选条件的关键字“WHERE”。以更新“Tom”手机号码的SQL语句为例，我将更新需要用到的SQL语句，单独写出来供你参考：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>UPDATE address_book SET phone=12300001111 WHERE id=1;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>在这条SQL语句中：</p><ul><li>“UPDATE”是指即将更新的数据表。</li><li>“WHERE”是指更新的条件，由于“id”的主键约束条件限制，它的值在这张表中是唯一的，因此通过“WHERE id=1”会读取该表的“id”字段，得到唯一的一条记录。</li><li>“SET”用于指定记录中的“phone”字段将被更新的具体值。</li></ul><p>这就是更新语句的各关键字的作用，那我们再来看看删除操作的SQL语句。例如我希望删除通讯录中的“Jerry”用户，就可以使用如下的SQL语句。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>DELETE FROM address_book WHERE id=1;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>在这条SQL语句中，“DELETE FROM”用于指定表，“WHERE”用于指定过滤条件。</p><p>我想你肯定还发现了，无论更新还是删除操作中，都包含了“WHERE”关键字。使用了“WHERE”关键字，也就意味这“UPDATE和DELETE”也读取了数据库。因此，我们将插入和删除也称作是“使用SQL语句对数据库执行了一次查询”。当你为以后工作中编写复杂的“UPDATE和DELETE”语句时，如果遇到它们的性能达不到你预期的要求，可以从“查询”方面先对你的SQL语句进行优化。</p><p>在你对SQL语句不熟练的时候，我有一个建议提供给你，由于UPDATE和DELETE语句在没有指定条件时，会将整张表都进行更新和删除，所以我建议你在编写代码时，先通过SELECT得到要操作的数据，再将SELECT改写为UPDATE或DELETE语句，避免因手动操作失误导致数据发生丢失。</p><p>接下来我们就把修改和删除功能也加入到“OptSqlite”类中，实现对数据库的增删改查操作。</p><h3 id="实现增删改查的类" tabindex="-1"><a class="header-anchor" href="#实现增删改查的类"><span>实现增删改查的类</span></a></h3><p>实现了增删改查的“OptSqlite”类代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import sqlite3</span></span>
<span class="line"><span>import pathlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class OptSqlite(object):</span></span>
<span class="line"><span>    def __init__(self, dbname = &amp;quot;new.db&amp;quot;):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        :param dbname  数据库名称</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.dir = pathlib.PurePath(__file__).parent</span></span>
<span class="line"><span>        self.db = pathlib.PurePath(self.dir, dbname)</span></span>
<span class="line"><span>        self.conn = sqlite3.connect(self.db)</span></span>
<span class="line"><span>        self.cur = self.conn.cursor()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def close(self):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        关闭连接</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.cur.close()</span></span>
<span class="line"><span>        self.conn.close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def new_table(self, table_name):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        新建联系人表</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        sql = f&#39;&#39;&#39;CREATE TABLE {table_name}(</span></span>
<span class="line"><span>            id INTEGER PRIMARY KEY AUTOINCREMENT,</span></span>
<span class="line"><span>            name TEXT NOT NULL,</span></span>
<span class="line"><span>            phone INT NOT NULL</span></span>
<span class="line"><span>            )&#39;&#39;&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.cur.execute(sql)</span></span>
<span class="line"><span>            print(&amp;quot;创建表成功&amp;quot;)</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(&amp;quot;创建表失败&amp;quot;)</span></span>
<span class="line"><span>            print(f&amp;quot;失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def get_one_phone(self, username):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        获取一个联系人的电话</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        self.get_user_phone_sql = f&amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>            SELECT phone FROM address_book WHERE name = &amp;quot;{username}&amp;quot; &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.result = self.cur.execute(self.get_user_phone_sql)</span></span>
<span class="line"><span>            return self.result.fetchone()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&amp;quot;失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def get_all_contents(self):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        取得所有的联系人</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.result = self.cur.execute(&amp;quot;SELECT * FROM address_book&amp;quot;)</span></span>
<span class="line"><span>            return self.result.fetchall()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&amp;quot;失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def set_one_phone(self, name, phone):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        增加或修改一个联系人的电话</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        if self.get_one_phone(name):</span></span>
<span class="line"><span>            self.set_user_phone_sql = &#39;&#39;&#39;UPDATE address_book </span></span>
<span class="line"><span>            SET phone= ? WHERE name=?&#39;&#39;&#39;</span></span>
<span class="line"><span>            self.v =  (int(phone), str(name))</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            self.set_user_phone_sql = &#39;&#39;&#39;INSERT INTO address_book</span></span>
<span class="line"><span>            VALUES (?, ?, ?)&#39;&#39;&#39;</span></span>
<span class="line"><span>            self.v =  (None, str(name), int(phone))</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.cur.execute(self.set_user_phone_sql, self.v)</span></span>
<span class="line"><span>            self.conn.commit()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&amp;quot;失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def delete_one_content(self, name):</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        删除一个联系人的电话</span></span>
<span class="line"><span>        &amp;quot;&amp;quot;&amp;quot;</span></span>
<span class="line"><span>        self.delete_user_sql = f&#39;&#39;&#39;DELETE FROM address_book </span></span>
<span class="line"><span>                WHERE name=&amp;quot;{name}&amp;quot;&#39;&#39;&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            self.cur.execute(self.delete_user_sql)</span></span>
<span class="line"><span>            self.conn.commit()</span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            print(f&amp;quot;删除失败原因是：{e}&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &amp;quot;__main__&amp;quot;:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 实例化</span></span>
<span class="line"><span>    my_query = OptSqlite(&amp;quot;contents.db&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 创建一张表</span></span>
<span class="line"><span>    # my_query.new_table(&amp;quot;address_book&amp;quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 增加或修改一个联系人的电话</span></span>
<span class="line"><span>    my_query.set_one_phone(&amp;quot;Jerry&amp;quot;,&amp;quot;12344445556&amp;quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 查询一个联系人的电话</span></span>
<span class="line"><span>    phone = my_query.get_one_phone(&amp;quot;Jerry&amp;quot;)    </span></span>
<span class="line"><span>    print(phone)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 查询所有人的电话</span></span>
<span class="line"><span>    contents = my_query.get_all_contents()</span></span>
<span class="line"><span>    print(contents)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 删除一个联系人</span></span>
<span class="line"><span>    my_query.delete_one_content(&amp;quot;Jerry&amp;quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    contents = my_query.get_all_contents()</span></span>
<span class="line"><span>    print(contents)   </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 关闭连接</span></span>
<span class="line"><span>    my_query.close()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段代码中，实现的主要逻辑，是将代码的相似功能尽量封装成一个方法，将数据库初始化连接放在“<strong>init</strong>()”方法，并尽量复用这个连接。为此，我编写类“OptSqlite”实现通讯录操作的时候，使用了四个方法，我按照这四个方法在代码里的定义顺序依次为你分析一下。</p><p>第一个方法是创建通讯录的数据表。我把创建通讯录数据表的功能定义成类的一个方法。定义类的方法我刚才已经教过你了，它是借用函数的语法格式来定义的。</p><p>不过我在定义通讯录表的时候，还对id这个主键增加了一个新的修饰条件，叫做<strong>自增“AUTOINCREMENT”</strong>，它的用途是每插入一条记录，它的值就会自动+1。“SQL92标准”中规定自增只能修饰整数类型的主键，所以我把id的类型改为“INTEGER” ，否则在创建表时，SQLite会提示类型不符合要求而报错。</p><p>第二个方法是查看通讯录所有的联系人。这和我们学习过的查看单个联系人时，使用的“SELECT 某个字段”在SQL语句是有区别的。当你需要匹配所有字段时，不用把所有字段逐一写在“SELECT”SQL语句后面，你可以使用“*”来代替所有的字段，这样实现起来更便捷。</p><p>此外，在查询结果上面，由于fetchone()函数只返回多个结果中的第一条，因此我把它改为fetchall()函数，这样就能把查询到的所有联系人都显示出来。</p><p>而且Python比较友好的一点是，它会把整个通讯录显示为一个列表，每个联系人显示为元组，联系人的各种属性都放在相同的元组中，方便你能对取出来的数据再次处理。它的执行结果是：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[(1, &#39;Tom&#39;, 12344445555)， (2, &#39;Jerry&#39;, 12344445556)]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>第三个方法是更新用户手机号码，由于更新操作的UPDATE语句和新增操作INSERT语句，对通讯录这一场景，实现起来非常相似。因此我没为它们两个功能编写两个方法，而是都放在了同一个方法--“set_one_phone()”方法中了。</p><p>这样做的好处是，使用“set_one_phone()”方法的人不用区分联系人是否存在，如果用户不存在，则通过条件判断语句，使用“INSERT”语句新建一个联系人。如果联系人存在，则改用“UPDATE”语句更新联系人的手机号码。</p><p>第四个方法是删除某个联系人，使用的是“DELETE”SQL语句。由于这里的SQL语句拼接比较简单，我没有单独使用一个变量v来保存，而是使用了f-string字符串把变量直接替换到字符串中，拼接为一个SQL语句。</p><p>对于以后工作中遇到的简单的字符串替换，你也可以采用这种方式，会对代码阅读上带来比较流畅的阅读体验。</p><p>通过这四个方法，我实现了“OptSqlite”类的增删改查功能。实例化“OptSqlite”类之后，你只需了解每个方法的名称和参数，就能利用我编写的四个方法实现通讯录的完整操作。这也是采用类替代了函数实现更完善的封装，最大的优势。</p><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>最后，我来为你总结一下本讲的主要内容。我们在这节课第一次编写了基于类的代码。通过对比类和函数的差别，我们了解到类的编写方法。这些差别体现在如何定义类、类中的成员属性和方法、以及一个用于接收参数、在实例化类时完成初始化的特殊方法“<strong>init</strong>()”。当你接触更多的其他人编写的Python代码时，就会慢慢发现代码量较大的程序，都会采用基于类的方式封装代码。也希望你在掌握类之后能够通过读懂其他人的代码，对自己的编码能力进行提升。</p><p>此外，我还用类重新封装了基于SQLit的通讯录的基本功能，其中就包括增删改查。相信你在掌握了对数据库的封装之后，可以把原有需要用SQL与数据库打交道的接口，封装为类的方法，这样也有助于你能够把SQLite更多的应用于自己的办公优化中来。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>按照惯例，最后我来为你留一道思考题，在本讲的代码中，我使用“INSERT”增加联系人之前没有判断该联系人是否存在。你能否利用判断语句实现增加联系人前对联系人是否存在进行判断，并提示用户对重复联系人进行合并操作呢？</p><p>欢迎把你的思考和想法放在留言区，我们一起交流讨论。如果这节课学习的数据透视表对你的工作有帮助，也欢迎你把课程推荐给你的朋友或同事，一起做职场中的效率人。</p>`,88)]))}const r=n(p,[["render",l]]),o=JSON.parse('{"path":"/posts/Python%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%9E%E5%85%AC%E5%AE%9E%E6%88%98%E8%AF%BE/%E2%80%9C%E5%AD%98%E5%82%A8%E2%80%9D%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%92%8C%E6%96%87%E4%BB%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C/22%EF%BD%9CSQLite%E6%96%87%E6%9C%AC%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%9A%E5%A6%82%E4%BD%95%E8%BF%9B%E8%A1%8C%E6%95%B0%E6%8D%AE%E7%AE%A1%E7%90%86%EF%BC%88%E4%B8%8B%EF%BC%89%EF%BC%9F.html","title":"22｜SQLite文本数据库：如何进行数据管理（下）？","lang":"zh-CN","frontmatter":{"description":"22｜SQLite文本数据库：如何进行数据管理（下）？ 你好，我是尹会生。 在上节课，我提到了使用比较简单的SQL来操作SQLite，并为你讲解了数据库的基本操作步骤。 不过当你的程序功能越来越强大的时候，随之而来的就是代码的复杂度越来越高。像是上一讲，我们在进行SQLite数据库搜索的时候，你需要建立连接、申请游标对象，才能进行查询。而这些准备工作，...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Python%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%9E%E5%85%AC%E5%AE%9E%E6%88%98%E8%AF%BE/%E2%80%9C%E5%AD%98%E5%82%A8%E2%80%9D%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%92%8C%E6%96%87%E4%BB%B6%E7%9B%B8%E5%85%B3%E7%9A%84%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C/22%EF%BD%9CSQLite%E6%96%87%E6%9C%AC%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%9A%E5%A6%82%E4%BD%95%E8%BF%9B%E8%A1%8C%E6%95%B0%E6%8D%AE%E7%AE%A1%E7%90%86%EF%BC%88%E4%B8%8B%EF%BC%89%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"22｜SQLite文本数据库：如何进行数据管理（下）？"}],["meta",{"property":"og:description","content":"22｜SQLite文本数据库：如何进行数据管理（下）？ 你好，我是尹会生。 在上节课，我提到了使用比较简单的SQL来操作SQLite，并为你讲解了数据库的基本操作步骤。 不过当你的程序功能越来越强大的时候，随之而来的就是代码的复杂度越来越高。像是上一讲，我们在进行SQLite数据库搜索的时候，你需要建立连接、申请游标对象，才能进行查询。而这些准备工作，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"22｜SQLite文本数据库：如何进行数据管理（下）？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":17.9,"words":5371},"filePathRelative":"posts/Python自动化办公实战课/“存储”模块：和文件相关的常用操作/22｜SQLite文本数据库：如何进行数据管理（下）？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"22｜SQLite文本数据库：如何进行数据管理（下）？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/d3/70/d3c634ceb8b32dfbfb9886c95f3d7070.mp3\\"></audio></p>\\n<p>你好，我是尹会生。</p>\\n<p>在上节课，我提到了使用比较简单的SQL来操作SQLite，并为你讲解了数据库的基本操作步骤。</p>\\n<p>不过当你的程序功能越来越强大的时候，随之而来的就是代码的复杂度越来越高。像是上一讲，我们在进行SQLite数据库搜索的时候，你需要建立连接、申请游标对象，才能进行查询。而这些准备工作，我们更希望在程序运行的时候就准备好，这样就不必多次重复编写。</p>","autoDesc":true}');export{r as comp,o as data};
