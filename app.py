from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = "chave_secreta"

# Conectar ao banco
def get_db():
    conn = sqlite3.connect("banco.db")
    conn.row_factory = sqlite3.Row
    return conn

# Página do cliente
@app.route("/")
def index():
    conn = get_db()
    servicos = conn.execute("SELECT * FROM servicos").fetchall()
    horarios = conn.execute("SELECT * FROM horarios").fetchall()
    conn.close()
    return render_template("index.html", servicos=servicos, horarios=horarios)

# Login admin
@app.route("/login", methods=["GET","POST"])
def login():
    if request.method=="POST":
        usuario = request.form["usuario"]
        senha = request.form["senha"]
        conn = get_db()
        admin = conn.execute("SELECT * FROM admin WHERE usuario=? AND senha=?", (usuario, senha)).fetchone()
        conn.close()
        if admin:
            session["admin"] = usuario
            return redirect("/admin")
        else:
            return "Usuário ou senha incorretos"
    return render_template("login.html")

# Painel admin
@app.route("/admin")
def admin():
    if "admin" not in session:
        return redirect("/login")
    conn = get_db()
    servicos = conn.execute("SELECT * FROM servicos").fetchall()
    clientes = conn.execute("SELECT * FROM clientes").fetchall()
    horarios = conn.execute("SELECT * FROM horarios").fetchall()
    agendamentos = conn.execute("SELECT * FROM agendamentos").fetchall()
    feedbacks = conn.execute("SELECT * FROM feedbacks").fetchall()
    conn.close()
    return render_template("admin.html", servicos=servicos, clientes=clientes, horarios=horarios, agendamentos=agendamentos, feedbacks=feedbacks)

# Logout
@app.route("/logout")
def logout():
    session.pop("admin", None)
    return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True)