import { environment } from "../environment";
class CaixaDaLanchonete {
  total;
  message = null;

  calcularValorDaCompra(metodoDePagamento, itens) {
    return this._verifyCart(itens, metodoDePagamento)._calcPrice(itens)._calcWithPayment(metodoDePagamento);
  }

  _calcPrice(items) {
    if (!this.message) {
      this.total = items.reduce((acc, it) => {
        const data = it.split(",");
        switch (data[0]) {
          case "cafe":
            return acc + 3.0 * data[1];
          case "chantily":
            return acc + 1.5 * data[1];
          case "suco":
            return acc + 6.2 * data[1];
          case "sanduiche":
            return acc + 6.5 * data[1];
          case "queijo":
            return acc + 2.0 * data[1];
          case "salgado":
            return acc + 4.25 * data[1];
          case "combo1":
            return acc + 9.5 * data[1];
          case "combo2":
            return acc + 7.5 * data[1];
          default:
            return acc;
        }
      }, 0);
    }
    return this;
  }

  _verifyCart(items, methodPayment) {
    const data = [
      "cafe",
      "chantily",
      "suco",
      "sanduiche",
      "queijo",
      "salgado",
      "combo1",
      "combo2",
    ];
    if (['debito', 'credito','dinheiro'].every(it => methodPayment != it)) {
      this.message = "Forma de pagamento inválida!";
    }

    if (items.length > 0) {
      this.message = items.some((it) => it.split(",")[1] == 0)
        ? "Quantidade inválida!"
        : this.message;
        this.message = items.some((it) => data.some((x) => x == it.split(",")[0]))
        ? this.message
        : "Item inválido!";

      items.map((it) => {
        const data = it.split(",")[0];
        if (data == "chantily") {
          const bool = items.some((item) => {
            const result = item.split(",")[0];
            if (result) {
              return result == "cafe";
            }
          });
          if (!bool) {
            this.message = "Item extra não pode ser pedido sem o principal";
          }
        } else if (data == "queijo") {
          const bool = items.some((item) => {
            const result = item.split(",")[0];
            if (result) {
              return result == "sanduiche";
            }
          });
          if (!bool) {
            this.message = "Item extra não pode ser pedido sem o principal";
          }
        }
      });
    } else {
      this.message = "Não há itens no carrinho de compra!";
    }
    return this;
  }

  _calcWithPayment(payment) {
    if (!this.message) {
      if (payment == "dinheiro") {
        this.total = this.total * environment.DINHEIRO;
      } else if (payment == "credito") {
        this.total = this.total * environment.CREDITO;
      }
      return `R$ ${this.total.toFixed(2).replace('.', ',')}`
    } else {
      return this.message;
    }
  }
}

export { CaixaDaLanchonete };
