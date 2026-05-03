const intent = require('../intent/intent');
const parser = require('../intent/parser');

function resolve(input) {

  const type = intent.detect(input);

  if (type === 'procedure_register') {

    const data = parser.parse(input);

    return {
      async execute() {
        return {
          action: 'procedure_register',
          data,
          message: 'ok'
        };
      }
    };
  }

  return {
    async execute() {
      return { message: 'não reconhecido' };
    }
  };
}

module.exports = { resolve };
