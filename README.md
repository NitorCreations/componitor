Componitor [![Build Status](https://secure.travis-ci.org/NitorCreations/componitor.png)](https://travis-ci.org/NitorCreations/componitor) [![Dependencies](https://david-dm.org/NitorCreations/componitor.png)]
=========

  Simple html template -like structures to create reusable [AngularJS](https://angularjs.org) html template directives on-the-fly.
  
  Enables easily creating reusable templates to facilitate DRY principle in AngularJS templates.
  
Turns this:

    <body ng-app="...">
      <labeled-input values="{model: user.username}">
        <label>Username:</label>
      </labeled-input>
        
      <componitor-template name="labeledInput">
        <label>
          <span class="labeled-input-heading">
            <content selector="label" />
          </span>
          <input type="text" ng-model="values.model"/>
        </label>
      </componitor-template>
    </body>

into this:

    <body ng-app="...">
      <labeled-input>
        <label>
          <span>Username:</span>
          <!-- Points to parent scope's user.username -->
          <input type="text" ng-model="values.model"/> 
        </label>
      </labeled-input>
        ...
    </body>

## Installation

### Bower

    bower install componitor
    
### Dependencies
* `angularjs >= 1.2`, tested on `1.2.16`
*  modern browser or [es5-shim](https://github.com/es-shims/es5-shim)

## Features

See [documentation](https://nitorcreations.github.io/componitor/) for usage examples.

## License

  [MIT](LICENSE)
