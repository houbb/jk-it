import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(c,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_08-测试数据-是不是可以把所有的参数都保存到excel中" tabindex="-1"><a class="header-anchor" href="#_08-测试数据-是不是可以把所有的参数都保存到excel中"><span>08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？</span></a></h1><p><audio id="audio" title="08 | 测试数据：是不是可以把所有的参数都保存到Excel中？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/2d/6e/2d4d9ee7fcc0e9509dc78cfc3c78926e.mp3"></audio></p><p>你好，我是陈磊。</p><p>课程到现在，我们已经一起从接口测试思维的训练，走到了接口测试技术的训练，随着学习的不断深入，你应该也有了一个自己的测试框架，虽然这个框架可能还很简陋。但是任何事情不管多晚开始，都好于从未开始，因此学到现在，你已经迈出了接口测试以及其测试技术的第一步。</p><p>做任何事情，从零到一都需要莫大的勇气和坚定的决心，在这个过程中，你要将自己挪出舒适区，进入一个陌生的领域，这确实很难。但如果你和我一起走到了这一节课，那么我要恭喜你，你已经完成了接口测试从零到一的转变，后续从一到无穷大，你只需要随着时间去积累经验就可以了。</p><p>如果把接口测试比喻成要炒一盘菜的话，那么我在之前的全部课程中，重点都是在讲解如何完成接口测试，也就是教你如何炒菜。我也教过你如何解决接口测试的需求，为你提供了解决问题的能力和手段，这也就是在帮你建造一个设备齐全的厨房，帮你一起完成接口测试任务 。</p><p>有了精致的厨房后，我也告诉了你要怎么制作顶级的厨具，也就是接口测试的技术方法和实践方式。这些厨具既有锅碗瓢盆，也有刀勺铲叉，这里的锅碗瓢盆就是你的测试框架，刀勺铲叉就是你使用框架完成的测试脚本，这其中既包含了单接口的测试脚本，也包含了业务逻辑多接口测试脚本。</p><p>那么如果想炒菜你还需要准备什么呢？毫无疑问那就是菜，所谓“巧妇难为无米之炊”，即使你有高超的手艺，有世界顶级的厨具，但如果没有做菜的原材料，那也没办法把菜做出来，就算是世界顶级大厨，也无法完成这样的任务。</p><p>今天我就顺着这个思路，和你讲讲菜的准备，也就是接口测试的数据准备工作。</p><h2 id="测试数据的好处-打造自动化测试框架" tabindex="-1"><a class="header-anchor" href="#测试数据的好处-打造自动化测试框架"><span>测试数据的好处：打造自动化测试框架</span></a></h2><p>随着你不断封装自己的测试框架，你的框架就始终处于等米下锅这样一种的状态，而米就是测试数据。我在之前的课程中，都是将测试数据直接写在代码里，赋值给一个变量，然后通过接口测试逻辑来完成测试。</p><p>说到这，我还是把我们之前用过的”战场“这个系统拿出来，看一看它“选择武器”这个接口测试脚本（你可以回到<a href="https://time.geekbang.org/column/article/195483" target="_blank" rel="noopener noreferrer">04</a>中查看），虽然你现在对怎么撰写、怎么封装类似的接口脚本都已经烂熟于心，但我们还是先看一下它的代码段：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># uri_login存储战场的选择武器</span></span>
<span class="line"><span>uri_selectEq = &#39;/selectEq&#39;</span></span>
<span class="line"><span># 武器编号变量存储用户名参数</span></span>
<span class="line"><span>equipmentid = &#39;10003&#39;</span></span>
<span class="line"><span># 拼凑body的参数</span></span>
<span class="line"><span>payload = &#39;equipmentid=&#39; + equipmentid</span></span>
<span class="line"><span>response_selectEq = comm.post(uri_selectEq,params=payload)</span></span>
<span class="line"><span>print(&#39;Response内容：&#39; + response_selectEq.text)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就是你通过自己的Common类改造后的测试框架，但是现在，它还不能是算是一个完美的框架，为什么呢？</p><p>这是因为，你现在的参数都是直接通过equipmentid变量赋值的，在做测试的时候，你还需要不断修改这个参数的赋值，才能完成接口的入参测试，这不是一种自动化的测试思路。</p><p>因此，你需要将数据封装，通过一种更好的方式，将数据存储到一种数据存储文件中，这样代码就可以自行查找对应的参数，然后调取测试框架执行测试流程，接着再通过自动比对返回预期，检验测试结果是否正确。</p><p>这样做有两个好处。</p><ol><li>无人值守，节省时间和精力。我们将所有的参数都存储到外部存储文件中，测试框架就可以自行选择第一个参数进行测试，在完成第一个测试之后，它也就可以自行选择下一个参数，整个执行过程是不需要人参与的。否则的话，我们每复制一组参数，就要执行一次脚本，然后再人工替换一次参数，再执行一次脚本，这个过程耗时费力，而且又是一个纯人工控制的没什么技术含量的活动。</li><li>自动检测返回值，提高测试效率。如果你用上面的代码段完成接口测试，就要每执行一次，人工去观察一次，看接口的返回是不是和预期一致，人工来做这些事情，不只非常耗费时间，效率也很低下。但是通过代码完成一些关键匹配却很容易，这可以大大提高测试效率，快速完成交付。</li></ol><p>怎么样，看到这些好处，你是不是也想马上给你的框架加上数据处理的部分了呢？</p><h2 id="如何选取测试数据" tabindex="-1"><a class="header-anchor" href="#如何选取测试数据"><span>如何选取测试数据</span></a></h2><p>现在我们就马上开始动手，为你的框架加上参数类。</p><p>首先，你先要定义一种参数的存储格式。那么我想问你的是，要是让你选择把数据储存在一个文件中，你会选择什么格式的文件呢？</p><p>我相信你肯定和我的选择一样，用Excel。因为目前来看，Excel是在设计测试用例方面使用最多的一个工具，那么我们也就可以用Excel作为自己的参数存储文件。</p><p>但在动手之前，你也应该想到，你的参数文件类型不会是一成不变的Excel，未来你也有可能使用其他格式的参数文件，因此在一开始你还要考虑到参数类的扩展性，这样你就不用每多了一种参数文件存储格式，就写一个参数类，来完成参数的选取和调用了。</p><p>那么如何选取和调用参数呢？你可以看看我设计的参数类：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import json</span></span>
<span class="line"><span>import xlrd</span></span>
<span class="line"><span>class Param(object):</span></span>
<span class="line"><span>  def __init__(self,paramConf=&#39;{}&#39;):</span></span>
<span class="line"><span>    self.paramConf = json.loads(paramConf)</span></span>
<span class="line"><span>  def paramRowsCount(self):</span></span>
<span class="line"><span>    pass</span></span>
<span class="line"><span>  def paramColsCount(self):</span></span>
<span class="line"><span>    pass</span></span>
<span class="line"><span>  def paramHeader(self):</span></span>
<span class="line"><span>    pass</span></span>
<span class="line"><span>  def paramAllline(self):</span></span>
<span class="line"><span>    pass</span></span>
<span class="line"><span>  def paramAlllineDict(self):</span></span>
<span class="line"><span>    pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class XLS(Param):</span></span>
<span class="line"><span>  &#39;&#39;&#39;</span></span>
<span class="line"><span>  xls基本格式(如果要把xls中存储的数字按照文本读出来的话,纯数字前要加上英文单引号:</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  第一行是参数的注释,就是每一行参数是什么</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  第二行是参数名,参数名和对应模块的po页面的变量名一致</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  第3~N行是参数</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  最后一列是预期默认头Exp</span></span>
<span class="line"><span>  &#39;&#39;&#39;</span></span>
<span class="line"><span>  def __init__(self, paramConf):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    :param paramConf: xls 文件位置(绝对路径)</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    self.paramConf = paramConf</span></span>
<span class="line"><span>    self.paramfile = self.paramConf[&#39;file&#39;]</span></span>
<span class="line"><span>    self.data = xlrd.open_workbook(self.paramfile)</span></span>
<span class="line"><span>    self.getParamSheet(self.paramConf[&#39;sheet&#39;])</span></span>
<span class="line"><span>  def getParamSheet(self,nsheets):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    设定参数所处的sheet</span></span>
<span class="line"><span>    :param nsheets: 参数在第几个sheet中</span></span>
<span class="line"><span>    :return:</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    self.paramsheet = self.data.sheets()[nsheets]</span></span>
<span class="line"><span>  def getOneline(self,nRow):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    返回一行数据</span></span>
<span class="line"><span>    :param nRow: 行数</span></span>
<span class="line"><span>    :return: 一行数据 []</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    return self.paramsheet.row_values(nRow)</span></span>
<span class="line"><span>  def getOneCol(self,nCol):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    返回一列</span></span>
<span class="line"><span>    :param nCol: 列数</span></span>
<span class="line"><span>    :return: 一列数据 []</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    return self.paramsheet.col_values(nCol)</span></span>
<span class="line"><span>  def paramRowsCount(self):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    获取参数文件行数</span></span>
<span class="line"><span>    :return: 参数行数 int</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    return self.paramsheet.nrows</span></span>
<span class="line"><span>  def paramColsCount(self):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    获取参数文件列数(参数个数)</span></span>
<span class="line"><span>    :return: 参数文件列数(参数个数) int</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    return self.paramsheet.ncols</span></span>
<span class="line"><span>  def paramHeader(self):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    获取参数名称</span></span>
<span class="line"><span>    :return: 参数名称[]</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    return self.getOneline(1)</span></span>
<span class="line"><span>  def paramAlllineDict(self):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    获取全部参数</span></span>
<span class="line"><span>    :return: {{}},其中dict的key值是header的值</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    nCountRows = self.paramRowsCount()</span></span>
<span class="line"><span>    nCountCols = self.paramColsCount()</span></span>
<span class="line"><span>    ParamAllListDict = {}</span></span>
<span class="line"><span>    iRowStep = 2</span></span>
<span class="line"><span>    iColStep = 0</span></span>
<span class="line"><span>    ParamHeader= self.paramHeader()</span></span>
<span class="line"><span>    while iRowStep &amp;lt; nCountRows:</span></span>
<span class="line"><span>    ParamOneLinelist=self.getOneline(iRowStep)</span></span>
<span class="line"><span>    ParamOnelineDict = {}</span></span>
<span class="line"><span>    while iColStep&amp;lt;nCountCols:</span></span>
<span class="line"><span>    ParamOnelineDict[ParamHeader[iColStep]]=ParamOneLinelist[iColStep]</span></span>
<span class="line"><span>    iColStep=iColStep+1</span></span>
<span class="line"><span>    iColStep=0</span></span>
<span class="line"><span>    ParamAllListDict[iRowStep-2]=ParamOnelineDict</span></span>
<span class="line"><span>    iRowStep=iRowStep+1</span></span>
<span class="line"><span>    return ParamAllListDict</span></span>
<span class="line"><span>  def paramAllline(self):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    获取全部参数</span></span>
<span class="line"><span>    :return: 全部参数[[]]</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    nCountRows= self.paramRowsCount()</span></span>
<span class="line"><span>    paramall = []</span></span>
<span class="line"><span>    iRowStep =2</span></span>
<span class="line"><span>    while iRowStep&amp;lt;nCountRows:</span></span>
<span class="line"><span>    paramall.append(self.getOneline(iRowStep))</span></span>
<span class="line"><span>    iRowStep=iRowStep+1</span></span>
<span class="line"><span>    return paramall</span></span>
<span class="line"><span>  def __getParamCell(self,numberRow,numberCol):</span></span>
<span class="line"><span>    return self.paramsheet.cell_value(numberRow,numberCol)</span></span>
<span class="line"><span>class ParamFactory(object):</span></span>
<span class="line"><span>  def chooseParam(self,type,paramConf):</span></span>
<span class="line"><span>    map_ = {</span></span>
<span class="line"><span>    &#39;xls&#39;: XLS(paramConf)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return map_[type</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这个代码看着很多，但你不需要完全看得懂，你只需要知道它解决问题的思路和方法就可以了，**思路就是通过统一抽象，建立一个公共处理数据的方式。**你可以设计和使用简单工厂类的设计模式，这样如果多一种参数存储类型，再添加一个对应的处理类就可以了，这很便于你做快速扩展，也可以一劳永逸地提供统一数据的处理模式。</p><p>如果你的技术栈和我不一样，那么你只需要搜索一下你自己技术栈所对应的简单工厂类设计模式，然后照猫画虎地把上面的逻辑实现一下就可以了。接下来，你就可以把这次测试的全部参数都存到Excel里面了，具体内容如下图所示：</p><img src="https://static001.geekbang.org/resource/image/93/5c/93da46d5d04c57a87f0cb6fe38583d5c.jpg" alt=""><p>通过上面的参数类你可以看出，在这个Excel文件中，第一行是给人读取的每一列参数的注释，而所有的Excel都是从第二行开始读取的，第二行是参数名和固定的表示预期结果的exp。现在，我们使用ParamFactory类，再配合上面的这个Excel，就可以完成”战场“系统“选择武器”接口的改造了，如下面这段代码所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#引入Common、ParamFactory类</span></span>
<span class="line"><span>from common import Common</span></span>
<span class="line"><span>from param import ParamFactory</span></span>
<span class="line"><span>import os</span></span>
<span class="line"><span># uri_login存储战场的选择武器</span></span>
<span class="line"><span>uri_selectEq = &#39;/selectEq&#39;</span></span>
<span class="line"><span>comm = Common(&#39;http://127.0.0.1:12356&#39;,api_type=&#39;http&#39;)</span></span>
<span class="line"><span># 武器编号变量存储武器编号，并且验证返回时是否有参数设计预期结果</span></span>
<span class="line"><span># 获取当前路径绝对值</span></span>
<span class="line"><span>curPath = os.path.abspath(&#39;.&#39;)</span></span>
<span class="line"><span># 定义存储参数的excel文件路径</span></span>
<span class="line"><span>searchparamfile = curPath+&#39;/equipmentid_param.xls&#39;</span></span>
<span class="line"><span># 调用参数类完成参数读取，返回是一个字典，包含全部的excel数据除去excel的第一行表头说明</span></span>
<span class="line"><span>searchparam_dict = ParamFactory().chooseParam(&#39;xls&#39;,{&#39;file&#39;:searchparamfile,&#39;sheet&#39;:0}).paramAlllineDict()</span></span>
<span class="line"><span>i=0</span></span>
<span class="line"><span>while i&amp;lt;len(searchparam_dict):</span></span>
<span class="line"><span>  # 读取通过参数类获取的第i行的参数</span></span>
<span class="line"><span>  payload = &#39;equipmentid=&#39; + searchparam_dict[i][&#39;equipmentid&#39;]</span></span>
<span class="line"><span>  # 读取通过参数类获取的第i行的预期</span></span>
<span class="line"><span>  exp=searchparam_dict[i][&#39;exp&#39;]</span></span>
<span class="line"><span>  # 进行接口测试</span></span>
<span class="line"><span>  response_selectEq = comm.post(uri_selectEq,params=payload)</span></span>
<span class="line"><span>  # 打印返回结果</span></span>
<span class="line"><span>  print(&#39;Response内容：&#39; + response_selectEq.text)</span></span>
<span class="line"><span>  # 读取下一行excel中的数据</span></span>
<span class="line"><span>  i=i+1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样再执行你的测试脚本，你就可以看到数据文件中的三条数据，已经都会顺序的自动执行了。那么后续如果将它付诸于你自己的技术栈，以及自己的测试驱动框架比如Python的<a href="https://docs.python.org/zh-cn/3/library/unittest.html" target="_blank" rel="noopener noreferrer">unittest</a>、Java的<a href="https://junit.org/junit5/" target="_blank" rel="noopener noreferrer">Junit</a>等，你就可以通过断言完成预期结果的自动验证了。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>今天我们接口测试数据准备的内容就到这里了，在接口测试的工作中，作为“巧妇”的测试工程师，还是需要参数这个“米”来下锅的，虽然我们之前课程中的代码涉及到参数的处理，但是都很简单粗暴，一点也不适合自动化的处理方式，因此今天，我带你完成了参数类的封装。</p><p>有的时候，我们也把参数类叫做参数池，这也就是说参数是存放在一个池子中，那我们准备好的池子就是Excel。我相信未来你也会不断扩展自己参数池的种类，这有可能是由于测试接口的特殊需求，也有可能是由于团队技术栈的要求。因此，我们封装参数池是通过简单工厂设计模式来实现的，如果你的代码基础并不好，那么你可以不用搞清楚简单工厂设计模式是什么，只需要知道如何模拟上述代码，再进行扩展就可以了。</p><p>一个好用的测试框架既要有很好的可用性，也要有很好的扩展性设计，这样我们的私有接口测试武器仓库就会变成可以不断扩展的、保持统一使用方法的武器仓库，这样才能让你或者你的团队在面对各种各样的测试任务时，既可以快速适应不同接口测试的需求，又不需要增加学习的成本。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>今天我们一起学习了参数类的设计，并且将它应用到”战场“系统的接口测试脚本中，后续我又告诉你为了能够完成代码的自动验证，你需要引入一些测试驱动框架，那么，你的技术栈是什么？你在你的框架中选取的测试驱动框架又是什么呢？你能将之前”战场“系统的全流程测试脚本通过参数类完成改造吗？我期待看到你的测试脚本。</p><p>我是陈磊，欢迎你在留言区留言分享你的观点，如果这篇文章让你有新的启发，也欢迎你把文章分享给你的朋友，我们一起沟通探讨。</p>`,39)]))}const t=n(p,[["render",l]]),m=JSON.parse('{"path":"/posts/%E6%8E%A5%E5%8F%A3%E6%B5%8B%E8%AF%95%E5%85%A5%E9%97%A8%E8%AF%BE/%E8%BF%9B%E9%98%B6%E6%8A%80%E8%83%BD%E7%AF%87/08%20_%20%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE%EF%BC%9A%E6%98%AF%E4%B8%8D%E6%98%AF%E5%8F%AF%E4%BB%A5%E6%8A%8A%E6%89%80%E6%9C%89%E7%9A%84%E5%8F%82%E6%95%B0%E9%83%BD%E4%BF%9D%E5%AD%98%E5%88%B0Excel%E4%B8%AD%EF%BC%9F.html","title":"08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？","lang":"zh-CN","frontmatter":{"description":"08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？ 你好，我是陈磊。 课程到现在，我们已经一起从接口测试思维的训练，走到了接口测试技术的训练，随着学习的不断深入，你应该也有了一个自己的测试框架，虽然这个框架可能还很简陋。但是任何事情不管多晚开始，都好于从未开始，因此学到现在，你已经迈出了接口测试以及其测试技术的第一步。 做任何事情，从零到...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E6%8E%A5%E5%8F%A3%E6%B5%8B%E8%AF%95%E5%85%A5%E9%97%A8%E8%AF%BE/%E8%BF%9B%E9%98%B6%E6%8A%80%E8%83%BD%E7%AF%87/08%20_%20%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE%EF%BC%9A%E6%98%AF%E4%B8%8D%E6%98%AF%E5%8F%AF%E4%BB%A5%E6%8A%8A%E6%89%80%E6%9C%89%E7%9A%84%E5%8F%82%E6%95%B0%E9%83%BD%E4%BF%9D%E5%AD%98%E5%88%B0Excel%E4%B8%AD%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？"}],["meta",{"property":"og:description","content":"08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？ 你好，我是陈磊。 课程到现在，我们已经一起从接口测试思维的训练，走到了接口测试技术的训练，随着学习的不断深入，你应该也有了一个自己的测试框架，虽然这个框架可能还很简陋。但是任何事情不管多晚开始，都好于从未开始，因此学到现在，你已经迈出了接口测试以及其测试技术的第一步。 做任何事情，从零到..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":11.21,"words":3364},"filePathRelative":"posts/接口测试入门课/进阶技能篇/08 _ 测试数据：是不是可以把所有的参数都保存到Excel中？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"08 | 测试数据：是不是可以把所有的参数都保存到Excel中？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/2d/6e/2d4d9ee7fcc0e9509dc78cfc3c78926e.mp3\\"></audio></p>\\n<p>你好，我是陈磊。</p>\\n<p>课程到现在，我们已经一起从接口测试思维的训练，走到了接口测试技术的训练，随着学习的不断深入，你应该也有了一个自己的测试框架，虽然这个框架可能还很简陋。但是任何事情不管多晚开始，都好于从未开始，因此学到现在，你已经迈出了接口测试以及其测试技术的第一步。</p>","autoDesc":true}');export{t as comp,m as data};
