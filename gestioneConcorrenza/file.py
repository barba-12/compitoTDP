import threading
import time

#1 indica il numero di thread che posso essere eseguiti nella sezione protetta
semaforo = threading.Semaphore(1)

bigliettiDisponibili = 2

def prenota_biglietto(id):
    global bigliettiDisponibili

    print(f"Thread {id}: tenta la prenotazione...")

    with semaforo:   #entra nel semaforo
        if bigliettiDisponibili > 0:
            print(f"Thread {id}: biglietto disponibile! Procedo alla prenotazione...")
            time.sleep(1) #simulazione tempo di elaborazione
            bigliettiDisponibili -= 1
            print(f"Thread {id}: prenotazione completata! Biglietti rimasti: {bigliettiDisponibili}")
        else:
            print(f"Thread {id}: nessun biglietto disponibile.")

def main():
    threads = []

    # Creazione dei thread
    for i in range(3):
        t = threading.Thread(target=prenota_biglietto, args=(i+1,)) #indico la funzione che il thread deve eseguire e i parametri da passarci
        threads.append(t)
        t.start()

    # Attesa della terminazione di tutti i thread
    for t in threads:
        t.join()

main()