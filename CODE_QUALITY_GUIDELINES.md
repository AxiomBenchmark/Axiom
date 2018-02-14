#Code Quality Guidelines
All code must comply with the W3C guidelines of HTML.
##Comments
Multi Line comments should be used for all formal documentation inside the document. Use single line comments for debugging. All debugging code should be removed before inspection.
##Naming Conventions
All names must be descriptive.
Variable and function names in Javascript must be written in camelCase. 
Constants must be written in all capital letters. 
However, HTML and CSS attributes can use hyphens when required by the framework. In general html elements should also be written in lowercase.
##Variables
###Global Variables
Global variables are not to be used unless they are included in a template.
###Local Variables
All variables must always be declared using var. All variables should be initailized to some value that indicates their intended use and intended data type. Do not change a variable from its intended data type. 
Do not use Number, String, or Boolean Objects. Do not use new Object().
##Indentation
Always use 4 spaces for indentation. Do not use tabs.
Always put spaces around operators and after commas. The exception to this rule is when using equals signs in HTML.
##Statement Rules
Simple statements must end with a semicolon
Functions and loops do not end with a semicolon.
Opening brackets must be at the end of the first line and must have a space before them.
Clonsing brackets must be on a new line.
##Comparisons
Use === for all JavaScript comparisons. If you need to compare objects of different types, make sure that they are being converted correctly.  
##Functions
Since Javascript does not check for missing arguments, all arguments should have default values or check to make sure that all arguments are used. All arguments to functions must be explained in documentation. The return value of a function must also be explained.
##HTML
Declare the doctype at the beginning of the file.
Close all HTML elements. For empty elements, use the closing slash.
Avoid using unnecesary spacing. The innermost element in an HTML file does not need to be indented separately. 
Declare the html, head, and body tags in all HTML files. The head must contain a title element. The title must be descriptive and make our website easy to find on a search engine.  The header must also contain any meta data. The body must contain all other code.
When creating new elements, use lowercase.
All attribute values must be in quotation marks.
Be consistent with capitalization when accessing files.
