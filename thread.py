import threading
import time

def applicazione_a():
    """Simula un'app che scrive messaggi periodici"""
    for i in range(5):
        print(f"app A: Messaggio {i+1}")
        time.sleep(1)
    print("app A: terminata")

def applicazione_b():
    """Simula un'app che fa calcoli"""
    for i in range(5):
        risultato = (i+1) ** 2
        print(f"app B: Calcolo {i+1}: {risultato}")
        time.sleep(1)
    print("app B: Terminata")

# thread
t1 = threading.Thread(target=applicazione_a)
t2 = threading.Thread(target=applicazione_b)

# Avvio delle due "app"
t1.start()
t2.start()

# Aspetta finche entrambe finiscano
t1.join()
t2.join()

print("Tutte le applicazioni sono terminate")