Componitor [![Build Status](https://secure.travis-ci.org/NitorCreations/componitor.png)](https://travis-ci.org/NitorCreations/componitor)
=========

  Simple html template -like structures to create reusable [AngularJS](https://angularjs.org) html template directives on-the-fly.
  
  Enables easily creating reusable templates to facilitate DRY principle in AngularJS templates.
  
Turns this:

    <body ng-app="...">
    	<labeled-input>
        	<label>Username:</label>
        </labeled-input>
        
        <componitor-template name="labeledInput">
        	<label>
            	<span class="labeled-input-heading">
                	<content selector="label" />
                </span>
                <input type="text" />
            </label>
        </componitor-template>
    </body>

into this:

    <body ng-app="...">
    	<labeled-input>
        	<label>
            	<span>Username:</span>
                <input type="text" />
        	</label>
        </labeled-input>
        ...
    </body>

## Installation

### Bower

    bower install componitor
    
### Download

Download it [here](dist/componitor.js), or [minified](componitor.min.js)

### Dependencies
* `angularjs >= 1.2`, tested on `1.2.16`

## Features

See [documentation](dist/docs) for usage examples.

## License

  [MIT](LICENSE)
