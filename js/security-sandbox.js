document.addEventListener('DOMContentLoaded', () => {

    // --- TABS LOGIC ---
    const tabs = document.querySelectorAll('.sandbox-tab');
    const panels = document.querySelectorAll('.sandbox-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Add active to current
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // --- 1. XSS DEMO ---
    const xssInput = document.getElementById('xss-input');
    const btnXssAttack = document.getElementById('btn-xss-attack');
    const xssOutput = document.getElementById('xss-output');
    const btnXssSecure = document.getElementById('btn-xss-secure');
    let isXssSecure = false;

    btnXssAttack.addEventListener('click', () => {
        const val = xssInput.value;
        if (isXssSecure) {
            // Escaped (Secure)
            xssOutput.textContent = val;
        } else {
            // Unescaped (Vulnerable) - we use innerHTML. 
            // Note: modern browsers block <script> tags inserted via innerHTML.
            // To simulate it, we will execute it manually if we detect <script>.
            xssOutput.innerHTML = val;

            // Simulation of script execution for educational purposes
            if (val.toLowerCase().includes('<script>')) {
                const scriptContent = val.match(/<script>(.*?)<\/script>/i);
                if (scriptContent && scriptContent[1]) {
                    try {
                        eval(scriptContent[1]);
                    } catch (e) {
                        console.error("Eval error", e);
                    }
                }
            }
        }
    });

    btnXssSecure.addEventListener('click', () => {
        isXssSecure = !isXssSecure;
        if (isXssSecure) {
            btnXssSecure.textContent = "Désactiver la protection";
            btnXssSecure.classList.replace('btn--glass', 'btn--primary');
        } else {
            btnXssSecure.textContent = "Activer la protection (Escape HTML)";
            btnXssSecure.classList.replace('btn--primary', 'btn--glass');
        }
    });


    // --- 2. CSRF DEMO ---
    const balanceEl = document.getElementById('bank-balance');
    const bankLogEl = document.getElementById('bank-log');
    const btnCsrfAttack = document.getElementById('btn-csrf-attack');
    const csrfPayloadDisplay = document.getElementById('csrf-payload');
    const btnCsrfSecure = document.getElementById('btn-csrf-secure');

    let balance = 10000;
    let isCsrfSecure = false;

    function addLog(msg, type = 'info') {
        const div = document.createElement('div');
        div.className = type;
        div.textContent = msg;
        bankLogEl.appendChild(div);
        bankLogEl.scrollTop = bankLogEl.scrollHeight;
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    }

    btnCsrfAttack.addEventListener('click', () => {
        csrfPayloadDisplay.classList.remove('hidden');

        setTimeout(() => {
            if (isCsrfSecure) {
                // Attack fails
                addLog("[Sys] ❌ Transfert bloqué. Jeton Anti-CSRF manquant.", "error");
            } else {
                // Attack succeeds
                if (balance > 0) {
                    balance -= 1000;
                    balanceEl.textContent = formatMoney(balance);
                    addLog("[Sys] ⚠️ Virement de 1000 € vers compte Hacker effectué.", "warning");
                } else {
                    addLog("[Sys] ❌ Solde insuffisant.", "error");
                }
            }
            setTimeout(() => { csrfPayloadDisplay.classList.add('hidden'); }, 3000);
        }, 600);
    });

    btnCsrfSecure.addEventListener('click', () => {
        isCsrfSecure = !isCsrfSecure;
        if (isCsrfSecure) {
            btnCsrfSecure.textContent = "Désactiver Anti-CSRF Token";
            btnCsrfSecure.classList.replace('btn--glass', 'btn--primary');
            addLog("[Sys] Bouclier Anti-CSRF activé.", "info");
        } else {
            btnCsrfSecure.textContent = "Activer Anti-CSRF Token";
            btnCsrfSecure.classList.replace('btn--primary', 'btn--glass');
            addLog("[Sys] Bouclier Anti-CSRF désactivé.", "error");
        }
    });


    // --- 3. JWT DEMO ---
    const jwtHeadInput = document.getElementById('jwt-head-input');
    const jwtPayloadInput = document.getElementById('jwt-payload-input');
    const btnJwtSubmit = document.getElementById('btn-jwt-submit');
    const jwtResponse = document.getElementById('jwt-server-response');
    const btnJwtSecure = document.getElementById('btn-jwt-secure');

    let isJwtSecure = false;

    btnJwtSubmit.addEventListener('click', () => {
        try {
            const header = JSON.parse(jwtHeadInput.value);
            const payload = JSON.parse(jwtPayloadInput.value);

            jwtResponse.style.color = 'var(--text-muted)';
            jwtResponse.textContent = "Vérification...";

            setTimeout(() => {
                if (isJwtSecure) {
                    // Strict algorithm checking
                    if (header.alg !== "HS256") {
                        jwtResponse.style.color = "var(--red)";
                        jwtResponse.textContent = `❌ Accès refusé : Algorithme '${header.alg}' non autorisé. Format invalide ou tentative de manipulation.`;
                        return;
                    }
                    // In real life we verify signature here. We'll simplify.
                    jwtResponse.style.color = "var(--green)";
                    jwtResponse.textContent = `✅ Accès validé (HS256). Bonjour ${payload.role}.`;
                } else {
                    // Vulnerable logic (alg: none bypass)
                    if (header.alg.toLowerCase() === 'none') {
                        jwtResponse.style.color = "var(--red)";
                        jwtResponse.textContent = `⚠️ ATTENTION : Signature by-passée (alg: none). Connecté en tant que ${payload.role}.`;
                        // If they made themselves admin
                        if (payload.role === 'admin') {
                            jwtResponse.innerHTML += "<br><strong>🔥 FLAG: OP_ADMIN_ACCESS_GRANTED</strong>";
                        }
                    } else {
                        jwtResponse.style.color = "var(--green)";
                        jwtResponse.textContent = `✅ Accès validé. Bonjour ${payload.role}.`;
                    }
                }
            }, 800);

        } catch (e) {
            jwtResponse.style.color = "var(--gold)";
            jwtResponse.textContent = "Erreur JSON : structure invalide.";
        }
    });

    btnJwtSecure.addEventListener('click', () => {
        isJwtSecure = !isJwtSecure;
        if (isJwtSecure) {
            btnJwtSecure.textContent = "Désactiver le contrôle strict";
            btnJwtSecure.classList.replace('btn--glass', 'btn--primary');
        } else {
            btnJwtSecure.textContent = "Activer le contrôle strict de l'ALGO";
            btnJwtSecure.classList.replace('btn--primary', 'btn--glass');
        }
    });


    // --- 4. REENTRANCY DEMO ---
    const vulnTotal = document.getElementById('vuln-total');
    const vulnRecord = document.getElementById('vuln-record');
    const attackerStolen = document.getElementById('attacker-stolen');
    const btnHackContract = document.getElementById('btn-hack-contract');
    const btnReentSecure = document.getElementById('btn-reentrancy-secure');
    const vulnLineUpdate = document.getElementById('vuln-line-update');
    const reentrancyArrows = document.getElementById('reentrancy-arrows');

    let contractBankEth = 10.0;
    let attackerRecordEth = 1.0;
    let attackerWalletEth = 0.0;
    let isContractSecure = false;
    let isHacking = false;

    function updateDisply() {
        vulnTotal.textContent = contractBankEth.toFixed(1);
        vulnRecord.textContent = attackerRecordEth.toFixed(1);
        attackerStolen.textContent = attackerWalletEth.toFixed(1);
    }

    function createArrow(isReturn = false) {
        const arrow = document.createElement('div');
        arrow.className = 'arrow-anim';
        if (isReturn) {
            arrow.style.background = 'var(--green)';
            arrow.style.transform = 'rotate(180deg) translateY(50%)'; // reversed arrow
            arrow.style.borderLeftColor = 'var(--green)';
            // Arrow head color hack for return
            arrow.style.setProperty('--pseudo-col', 'var(--green)');
        }
        reentrancyArrows.innerHTML = '';
        reentrancyArrows.appendChild(arrow);
        setTimeout(() => { if (reentrancyArrows.contains(arrow)) arrow.remove(); }, 400);
    }

    btnHackContract.addEventListener('click', async () => {
        if (isHacking) return;
        isHacking = true;

        // Reset if empty
        if (contractBankEth <= 0) {
            contractBankEth = 10.0;
            attackerRecordEth = 1.0;
            attackerWalletEth = 0.0;
            updateDisply();
        }

        if (isContractSecure) {
            // SECURE LOGIC (Checks-Effects-Interactions)
            // 1. Checks: require(balance > 0)
            if (attackerRecordEth > 0) {
                // 2. Effects: update state FIRST
                let amountToSend = attackerRecordEth;
                attackerRecordEth = 0;
                updateDisply();

                // 3. Interactions: send ETH
                createArrow();
                await new Promise(r => setTimeout(r, 400));
                createArrow(true); // Return trigger fallback

                contractBankEth -= amountToSend;
                attackerWalletEth += amountToSend;
                updateDisply();

                // Re-entrant call attempt (fallback triggers withdraw again)
                // But attackerRecordEth is now 0, so requires fails. Attack stopped!
            }
            isHacking = false;
        } else {
            // VULNERABLE LOGIC
            const amountToSend = attackerRecordEth;

            const pump = async () => {
                if (contractBankEth >= amountToSend && attackerRecordEth > 0) {
                    // msg.sender.call -> sends money
                    createArrow();
                    await new Promise(r => setTimeout(r, 200));
                    contractBankEth -= amountToSend;
                    attackerWalletEth += amountToSend;
                    updateDisply();

                    // The attacker's fallback function receives ETH and re-calls withdraw() BEFORE the state update
                    createArrow(true); // Return call
                    await new Promise(r => setTimeout(r, 200));
                    await pump(); // Recursive call!
                }
            };

            await pump();

            // Finally, after the recursion unwinds, state gets updated to 0 (too late)
            attackerRecordEth = 0;
            updateDisply();
            isHacking = false;
        }
    });

    btnReentSecure.addEventListener('click', () => {
        isContractSecure = !isContractSecure;

        if (isContractSecure) {
            btnReentSecure.textContent = "Désactiver la protection";
            btnReentSecure.classList.replace('btn--glass', 'btn--primary');
            vulnLineUpdate.className = "good-line";
            vulnLineUpdate.textContent = "balances[msg.sender] = 0; // AVANT L'APPEL (Safe)";

            // Reset state for new demo
            contractBankEth = 10.0;
            attackerRecordEth = 1.0;
            attackerWalletEth = 0.0;
            updateDisply();
        } else {
            btnReentSecure.textContent = "Appliquer Checks-Effects-Interactions";
            btnReentSecure.classList.replace('btn--primary', 'btn--glass');
            vulnLineUpdate.className = "bad-line";
            vulnLineUpdate.textContent = "balances[msg.sender] = 0; // TROP TARD!";

            contractBankEth = 10.0;
            attackerRecordEth = 1.0;
            attackerWalletEth = 0.0;
            updateDisply();
        }
    });

});
